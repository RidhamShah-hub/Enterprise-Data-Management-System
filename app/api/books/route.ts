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

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const category = searchParams.get("category")

    let books
    if (query) {
      books = await DatabaseManager.searchBooks(query, category || undefined)
    } else {
      books = await DatabaseManager.getAllBooks()
    }

    return NextResponse.json({ success: true, books })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch books",
      },
      { status: 500 },
    )
  }
}
