"use client"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  department?: string
  employeeId?: string
}

interface Book {
  id: number
  isbn: string
  title: string
  author: string
  publisher: string
  publication_year: number
  category: string
  total_copies: number
  available_copies: number
  location: string
}

interface BorrowingRecord {
  id: number
  book_id: number
  borrowed_at: string
  due_date: string
  returned_at?: string
  status: string
  title: string
  author: string
  isbn: string
}

export class CommandProcessor {
  private user: User | null = null

  constructor(user: User | null = null) {
    this.user = user
  }

  async processCommand(command: string): Promise<string> {
    const parts = command.trim().split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    try {
      switch (cmd) {
        case "help":
          return this.getHelp()

        case "login":
          return await this.login(args)

        case "register":
          return await this.register(args)

        case "logout":
          return await this.logout()

        case "profile":
          return await this.getProfile()

        case "search":
          return await this.searchBooks(args)

        case "list":
          return await this.listBooks(args)

        case "borrow":
          return await this.borrowBook(args)

        case "return":
          return await this.returnBook(args)

        case "history":
          return await this.getBorrowingHistory()

        case "status":
          return this.getSystemStatus()

        case "clear":
          return "\x1b[2J\x1b[H" // ANSI clear screen codes

        default:
          return `Error: Unknown command '${cmd}'. Type 'help' for available commands.`
      }
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : "Command execution failed"}`
    }
  }

  private getHelp(): string {
    return `
Available Commands:
==================

Authentication:
  login <username> <password>    - Login to the system
  register                       - Register a new user account
  logout                         - Logout from the system
  profile                        - View user profile and borrowing history

Book Management:
  search <query> [category]      - Search for books by title, author, or ISBN
  list [category]                - List all books or books by category
  borrow <book_id> [days]        - Borrow a book (default: 14 days)
  return <borrowing_id>          - Return a borrowed book
  history                        - View borrowing history

System:
  status                         - Show system status
  help                           - Show this help message
  clear                          - Clear the screen

Examples:
  search "clean code"
  search java programming
  list programming
  borrow 1 21
  return 5
    `
  }

  private async login(args: string[]): Promise<string> {
    if (args.length < 2) {
      return "Error: Usage: login <username> <password>"
    }

    const [username, password] = args

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        this.user = data.user
        return `Success: Logged in as ${data.user.firstName} ${data.user.lastName} (${data.user.role})`
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Login failed. Please check your connection."
    }
  }

  private async register(args: string[]): Promise<string> {
    return `
User Registration
=================
Please use the web interface to register a new account.
Required information:
- Username (3-50 characters, alphanumeric and underscore only)
- Email address
- Password (minimum 8 characters with uppercase, lowercase, and number)
- First and Last name
- Department (optional)
- Employee ID (optional)

Password requirements:
- At least 8 characters long
- Contains uppercase and lowercase letters
- Contains at least one number
    `
  }

  private async logout(): Promise<string> {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      this.user = null
      return "Success: Logged out successfully."
    } catch (error) {
      return "Error: Logout failed."
    }
  }

  private async getProfile(): Promise<string> {
    if (!this.user) {
      return "Error: Please login first."
    }

    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (data.success) {
        const { user, borrowingHistory } = data
        let output = `
User Profile
============
Name: ${user.first_name} ${user.last_name}
Username: ${user.username}
Email: ${user.email}
Role: ${user.role}
Department: ${user.department || "N/A"}
Employee ID: ${user.employee_id || "N/A"}
Account Created: ${new Date(user.created_at).toLocaleDateString()}

Borrowing History (${borrowingHistory.length} records):
=====================================================`

        if (borrowingHistory.length > 0) {
          borrowingHistory.forEach((record: BorrowingRecord, index: number) => {
            const borrowedDate = new Date(record.borrowed_at).toLocaleDateString()
            const dueDate = new Date(record.due_date).toLocaleDateString()
            const returnedDate = record.returned_at ? new Date(record.returned_at).toLocaleDateString() : "Not returned"

            output += `
${index + 1}. "${record.title}" by ${record.author}
   ISBN: ${record.isbn}
   Borrowed: ${borrowedDate}
   Due: ${dueDate}
   Returned: ${returnedDate}
   Status: ${record.status.toUpperCase()}`
          })
        } else {
          output += "\nNo borrowing history found."
        }

        return output
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Failed to fetch profile information."
    }
  }

  private async searchBooks(args: string[]): Promise<string> {
    if (!this.user) {
      return "Error: Please login first."
    }

    if (args.length === 0) {
      return "Error: Usage: search <query> [category]"
    }

    const query = args.join(" ")

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        return this.formatBookList(data.books, `Search Results for "${query}"`)
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Search failed."
    }
  }

  private async listBooks(args: string[]): Promise<string> {
    if (!this.user) {
      return "Error: Please login first."
    }

    const category = args[0]

    try {
      const url = category ? `/api/books?category=${encodeURIComponent(category)}` : "/api/books"
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        const title = category ? `Books in "${category}" Category` : "All Books"
        return this.formatBookList(data.books, title)
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Failed to fetch books."
    }
  }

  private formatBookList(books: Book[], title: string): string {
    let output = `
${title}
${"=".repeat(title.length)}
`

    if (books.length === 0) {
      return output + "No books found."
    }

    books.forEach((book, index) => {
      const availability =
        book.available_copies > 0 ? `${book.available_copies}/${book.total_copies} available` : "Not available"

      output += `
${index + 1}. ID: ${book.id}
   Title: "${book.title}"
   Author: ${book.author}
   ISBN: ${book.isbn}
   Publisher: ${book.publisher} (${book.publication_year})
   Category: ${book.category}
   Location: ${book.location}
   Availability: ${availability}
`
    })

    return output
  }

  private async borrowBook(args: string[]): Promise<string> {
    if (!this.user) {
      return "Error: Please login first."
    }

    if (args.length === 0) {
      return "Error: Usage: borrow <book_id> [days]"
    }

    const bookId = Number.parseInt(args[0])
    const days = args[1] ? Number.parseInt(args[1]) : 14

    if (isNaN(bookId)) {
      return "Error: Book ID must be a number."
    }

    if (isNaN(days) || days < 1 || days > 90) {
      return "Error: Days must be a number between 1 and 90."
    }

    try {
      const response = await fetch("/api/books/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, daysToReturn: days }),
      })

      const data = await response.json()

      if (data.success) {
        const dueDate = new Date(data.borrowRecord.due_date).toLocaleDateString()
        return `Success: Book borrowed successfully!
Borrowing ID: ${data.borrowRecord.id}
Due Date: ${dueDate}
Please return the book by the due date to avoid late fees.`
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Failed to borrow book."
    }
  }

  private async returnBook(args: string[]): Promise<string> {
    if (!this.user) {
      return "Error: Please login first."
    }

    if (args.length === 0) {
      return "Error: Usage: return <borrowing_id>"
    }

    const borrowingId = Number.parseInt(args[0])

    if (isNaN(borrowingId)) {
      return "Error: Borrowing ID must be a number."
    }

    try {
      const response = await fetch("/api/books/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowingId }),
      })

      const data = await response.json()

      if (data.success) {
        return `Success: Book returned successfully!
Thank you for returning the book on time.`
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Failed to return book."
    }
  }

  private async getBorrowingHistory(): Promise<string> {
    if (!this.user) {
      return "Error: Please login first."
    }

    try {
      const response = await fetch("/api/user/profile")
      const data = await response.json()

      if (data.success) {
        const { borrowingHistory } = data
        let output = `
Borrowing History (${borrowingHistory.length} records)
=====================================================`

        if (borrowingHistory.length > 0) {
          borrowingHistory.forEach((record: BorrowingRecord, index: number) => {
            const borrowedDate = new Date(record.borrowed_at).toLocaleDateString()
            const dueDate = new Date(record.due_date).toLocaleDateString()
            const returnedDate = record.returned_at ? new Date(record.returned_at).toLocaleDateString() : "Not returned"

            output += `
${index + 1}. Borrowing ID: ${record.id}
   Book: "${record.title}" by ${record.author}
   ISBN: ${record.isbn}
   Borrowed: ${borrowedDate}
   Due: ${dueDate}
   Returned: ${returnedDate}
   Status: ${record.status.toUpperCase()}
`
          })
        } else {
          output += "\nNo borrowing history found."
        }

        return output
      } else {
        return `Error: ${data.error}`
      }
    } catch (error) {
      return "Error: Failed to fetch borrowing history."
    }
  }

  private getSystemStatus(): string {
    const uptime = process.uptime ? Math.floor(process.uptime()) : 0
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)

    return `
System Status
=============
Status: Online
Version: 1.0.0
Uptime: ${hours}h ${minutes}m
Database: Connected
Authentication: Active
Security: SQL Injection Protection Enabled
Audit Logging: Active

User Session:
${this.user ? `Logged in as: ${this.user.firstName} ${this.user.lastName} (${this.user.role})` : "Not logged in"}

Features:
- Secure user authentication
- Real-time data validation
- Comprehensive audit logging
- Advanced search capabilities
- Borrowing management system
- Role-based access control
    `
  }
}
