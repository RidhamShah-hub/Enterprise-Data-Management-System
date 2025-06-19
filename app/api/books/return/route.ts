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

    const { borrowingId } = await request.json()

    if (!borrowingId) {
      return NextResponse.json({ error: "Borrowing ID is required" }, { status: 400 })
    }

    const returnRecord = await DatabaseManager.returnBook(borrowingId)
    await DatabaseManager.logActivity(session.user_id, "RETURN_BOOK", "borrowing_records", borrowingId)

    return NextResponse.json({ success: true, returnRecord })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to return book",
      },
      { status: 400 },
    )
  }
}
