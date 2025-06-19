import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Database utility functions with SQL injection protection
export class DatabaseManager {
  // User management
  static async createUser(userData: {
    username: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    role?: string
    department?: string
    employeeId?: string
  }) {
    const result = await sql`
      INSERT INTO users (username, email, password_hash, first_name, last_name, role, department, employee_id)
      VALUES (${userData.username}, ${userData.email}, ${userData.passwordHash}, 
              ${userData.firstName}, ${userData.lastName}, ${userData.role || "user"}, 
              ${userData.department || null}, ${userData.employeeId || null})
      RETURNING id, username, email, first_name, last_name, role, department, employee_id, created_at
    `
    return result[0]
  }

  static async getUserByUsername(username: string) {
    console.log(`[DatabaseManager] Attempting to get user by username: ${username}`)
    console.log(`[DatabaseManager] DATABASE_URL used: ${process.env.DATABASE_URL ? "Set" : "NOT SET"}`) // Check if URL is loaded
    try {
      const result = await sql`
        SELECT id, username, email, password_hash, first_name, last_name, role, department, employee_id, is_active
        FROM users 
        WHERE username = ${username} AND is_active = true
      `
      console.log(`[DatabaseManager] Result for username ${username}:`, result[0] || null)
      return result[0] || null
    } catch (error) {
      console.error(`[DatabaseManager] Error fetching user ${username}:`, error)
      return null
    }
  }

  static async getUserById(userId: number) {
    const result = await sql`
      SELECT id, username, email, first_name, last_name, role, department, employee_id, created_at
      FROM users 
      WHERE id = ${userId} AND is_active = true
    `
    return result[0] || null
  }

  // Session management
  static async createSession(userId: number, sessionToken: string, expiresAt: Date) {
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (${userId}, ${sessionToken}, ${expiresAt.toISOString()})
    `
  }

  static async getSessionByToken(sessionToken: string) {
    const result = await sql`
      SELECT s.*, u.id as user_id, u.username, u.role
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = ${sessionToken} 
        AND s.expires_at > NOW()
        AND u.is_active = true
    `
    return result[0] || null
  }

  static async deleteSession(sessionToken: string) {
    await sql`DELETE FROM user_sessions WHERE session_token = ${sessionToken}`
  }

  // Book management
  static async searchBooks(query: string, category?: string) {
    let result
    if (category) {
      result = await sql`
        SELECT * FROM books 
        WHERE (title ILIKE ${"%" + query + "%"} OR author ILIKE ${"%" + query + "%"} OR isbn ILIKE ${"%" + query + "%"})
          AND category = ${category}
        ORDER BY title
      `
    } else {
      result = await sql`
        SELECT * FROM books 
        WHERE title ILIKE ${"%" + query + "%"} OR author ILIKE ${"%" + query + "%"} OR isbn ILIKE ${"%" + query + "%"}
        ORDER BY title
      `
    }
    return result
  }

  static async getAllBooks() {
    const result = await sql`
      SELECT * FROM books 
      ORDER BY title
    `
    return result
  }

  static async getBookById(bookId: number) {
    const result = await sql`
      SELECT * FROM books WHERE id = ${bookId}
    `
    return result[0] || null
  }

  // Borrowing management
  static async borrowBook(userId: number, bookId: number, dueDate: Date) {
    // Check if book is available
    const book = await sql`
      SELECT available_copies FROM books WHERE id = ${bookId}
    `

    if (!book[0] || book[0].available_copies <= 0) {
      throw new Error("Book is not available for borrowing")
    }

    // Start transaction
    await sql`BEGIN`

    try {
      // Create borrowing record
      const borrowRecord = await sql`
        INSERT INTO borrowing_records (user_id, book_id, due_date)
        VALUES (${userId}, ${bookId}, ${dueDate.toISOString()})
        RETURNING *
      `

      // Update available copies
      await sql`
        UPDATE books 
        SET available_copies = available_copies - 1 
        WHERE id = ${bookId}
      `

      await sql`COMMIT`
      return borrowRecord[0]
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  }

  static async returnBook(borrowingId: number) {
    await sql`BEGIN`

    try {
      // Get borrowing record
      const borrowRecord = await sql`
        SELECT * FROM borrowing_records WHERE id = ${borrowingId} AND status = 'borrowed'
      `

      if (!borrowRecord[0]) {
        throw new Error("Borrowing record not found or already returned")
      }

      // Update borrowing record
      await sql`
        UPDATE borrowing_records 
        SET returned_at = NOW(), status = 'returned'
        WHERE id = ${borrowingId}
      `

      // Update available copies
      await sql`
        UPDATE books 
        SET available_copies = available_copies + 1 
        WHERE id = ${borrowRecord[0].book_id}
      `

      await sql`COMMIT`
      return borrowRecord[0]
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  }

  static async getUserBorrowingHistory(userId: number) {
    const result = await sql`
      SELECT br.*, b.title, b.author, b.isbn
      FROM borrowing_records br
      JOIN books b ON br.book_id = b.id
      WHERE br.user_id = ${userId}
      ORDER BY br.borrowed_at DESC
    `
    return result
  }

  // Audit logging
  static async logActivity(
    userId: number | null,
    action: string,
    tableName?: string,
    recordId?: number,
    oldValues?: any,
    newValues?: any,
  ) {
    await sql`
      INSERT INTO audit_log (user_id, action, table_name, record_id, old_values, new_values)
      VALUES (${userId}, ${action}, ${tableName || null}, ${recordId || null}, 
              ${oldValues ? JSON.stringify(oldValues) : null}, 
              ${newValues ? JSON.stringify(newValues) : null})
    `
  }
}
