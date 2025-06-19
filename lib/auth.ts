import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { DatabaseManager } from "./database"

export class AuthManager {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12 // Increased salt rounds for better security
    return bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static generateSessionToken(): string {
    return randomBytes(32).toString("hex")
  }

  // testHashGeneration method has been removed

  static async authenticate(username: string, password: string) {
    // The call to testHashGeneration has been removed from here

    console.log(`[AuthManager] Authenticating user: ${username}`)
    // Input validation
    if (!username || !password) {
      console.log("[AuthManager] Username or password missing")
      throw new Error("Username and password are required")
    }

    if (username.length < 3 || username.length > 50) {
      console.log("[AuthManager] Invalid username length")
      throw new Error("Username must be between 3 and 50 characters")
    }

    // Get user from database
    const user = await DatabaseManager.getUserByUsername(username)
    console.log(`[AuthManager] User object from DB for ${username}:`, user)

    if (!user) {
      console.log(`[AuthManager] User ${username} not found in DB or is inactive.`)
      await DatabaseManager.logActivity(null, "LOGIN_FAILED_USER_NOT_FOUND", undefined, undefined, { username })
      throw new Error("Invalid credentials")
    }

    // Verify password
    console.log(`[AuthManager] Verifying password for ${username}. DB hash: ${user.password_hash}`)
    const isValidPassword = await this.verifyPassword(password, user.password_hash)
    console.log(`[AuthManager] Password for ${username} is valid: ${isValidPassword}`)

    if (!isValidPassword) {
      console.log(`[AuthManager] Password verification failed for ${username}.`)
      await DatabaseManager.logActivity(user.id, "LOGIN_FAILED_INVALID_PASSWORD", undefined, undefined, { username })
      throw new Error("Invalid credentials")
    }

    // Create session
    const sessionToken = this.generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await DatabaseManager.createSession(user.id, sessionToken, expiresAt)
    console.log(`[AuthManager] Session created for ${username}.`)
    await DatabaseManager.logActivity(user.id, "LOGIN_SUCCESS")

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        employeeId: user.employee_id,
      },
      sessionToken,
    }
  }

  static async register(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    department?: string
    employeeId?: string
  }) {
    // Input validation
    this.validateUserInput(userData)

    // Check if user already exists
    const existingUser = await DatabaseManager.getUserByUsername(userData.username)
    if (existingUser) {
      throw new Error("Username already exists")
    }

    // Hash password
    const passwordHash = await this.hashPassword(userData.password)

    // Create user
    const user = await DatabaseManager.createUser({
      ...userData,
      passwordHash,
    })

    await DatabaseManager.logActivity(user.id, "REGISTER")

    return user
  }

  static validateUserInput(userData: {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
  }) {
    // Username validation
    if (!userData.username || userData.username.length < 3 || userData.username.length > 50) {
      throw new Error("Username must be between 3 and 50 characters")
    }

    if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      throw new Error("Username can only contain letters, numbers, and underscores")
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!userData.email || !emailRegex.test(userData.email)) {
      throw new Error("Please provide a valid email address")
    }

    // Password validation
    if (!userData.password || userData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long")
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
      throw new Error("Password must contain at least one uppercase letter, one lowercase letter, and one number")
    }

    // Name validation
    if (!userData.firstName || userData.firstName.length < 1 || userData.firstName.length > 50) {
      throw new Error("First name must be between 1 and 50 characters")
    }

    if (!userData.lastName || userData.lastName.length < 1 || userData.lastName.length > 50) {
      throw new Error("Last name must be between 1 and 50 characters")
    }
  }

  static async validateSession(sessionToken: string) {
    if (!sessionToken) {
      return null
    }

    const session = await DatabaseManager.getSessionByToken(sessionToken)
    return session
  }

  static async logout(sessionToken: string) {
    const session = await DatabaseManager.getSessionByToken(sessionToken)
    if (session) {
      await DatabaseManager.deleteSession(sessionToken)
      await DatabaseManager.logActivity(session.user_id, "LOGOUT")
    }
  }
}
