import { type NextRequest, NextResponse } from "next/server"
import { DatabaseManager } from "@/lib/database"
import { AuthManager } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Validate session
    const sessionToken = request.cookies.get("session_token")?.value
    const session = await AuthManager.validateSession(sessionToken || "")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookId, daysToReturn = 14 } = await request.json()

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + daysToReturn)

    const borrowRecord = await DatabaseManager.borrowBook(session.user_id, bookId, dueDate)
    await DatabaseManager.logActivity(session.user_id, "BORROW_BOOK", "borrowing_records", borrowRecord.id)

    return NextResponse.json({ success: true, borrowRecord })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to borrow book",
      },
      { status: 400 },
    )
  }
}
