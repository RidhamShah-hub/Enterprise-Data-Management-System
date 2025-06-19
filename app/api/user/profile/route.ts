import { type NextRequest, NextResponse } from "next/server"
import { DatabaseManager } from "@/lib/database"
import { AuthManager } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const sessionToken = request.cookies.get("session_token")?.value
    const session = await AuthManager.validateSession(sessionToken || "")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await DatabaseManager.getUserById(session.user_id)
    const borrowingHistory = await DatabaseManager.getUserBorrowingHistory(session.user_id)

    return NextResponse.json({
      success: true,
      user,
      borrowingHistory,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch profile",
      },
      { status: 500 },
    )
  }
}
