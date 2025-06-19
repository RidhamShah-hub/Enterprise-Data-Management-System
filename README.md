# Enterprise Data Management System (EDMS) CLI

Welcome to the Enterprise Data Management System (EDMS) Command-Line Interface! This Next.js application provides a terminal-based interface for managing users, books/resources, and borrowing records within an enterprise context. It features secure authentication, role-based access concepts, and a robust set of commands for data interaction.

## Features

*   **Command-Line Interface (CLI):** Interact with the system using text-based commands in a familiar terminal environment.
*   **Secure User Authentication:** User login with password hashing (bcrypt) and session management.
*   **Resource Management:** Search, list, borrow, and return books/resources.
*   **User Profiles:** View user details and borrowing history.
*   **Database Integration:** Uses Neon serverless Postgres for data storage.
*   **Audit Logging Concepts:** Schema includes an audit log table for tracking system activities (further implementation needed for full utilization).
*   **Role-Based Access (Conceptual):** Defines 'admin', 'librarian', and 'user' roles, with the foundation for future role-specific permissions.

## Tech Stack

*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Database:** Neon (Serverless Postgres)
*   **Styling:** Tailwind CSS (for the web page hosting the CLI)
*   **UI Components:** shadcn/ui
*   **Password Hashing:** bcryptjs
*   **Icons:** Lucide React

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Setup Instructions

Follow these steps to get the EDMS CLI running on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder-name>

2. **Install Dependencies:**

```shellscript
npm install
# or
yarn install
```


3. **Set Up Neon Database:**

1. Go to [Neon](https://neon.tech/) and sign up or log in.
2. Create a new Project.
3. Once the project is created, find the **Connection String** (it usually looks like `postgresql://user:password@host/dbname`). You'll need the one that includes your password.

1. Navigate to your project's dashboard.
2. Under "Connection Details", select the "psql" format or look for a URI that includes your role and password.






4. **Configure Environment Variables:**

1. Create a new file named `.env.local` in the root of your project.
2. Add your Neon database connection string to this file:

```plaintext
DATABASE_URL="your_neon_database_connection_string"
```

Replace `"your_neon_database_connection_string"` with the actual string you copied from Neon.





5. **Run Database Schema and Seed Scripts:**
The project includes SQL scripts to set up the database schema and populate it with initial data. You'll need a way to run these against your Neon database.

1. **Using Neon's SQL Editor:**

1. In your Neon project dashboard, go to the "SQL Editor".
2. Copy the content of `scripts/01-create-schema.sql` and run it.
3. Then, copy the content of `scripts/02-seed-data.sql` and run it.



2. **Using a PSQL Client (if you have one configured):**
Connect to your Neon database using `psql` and your connection string, then run the scripts:

```shellscript
psql "your_neon_database_connection_string" -f scripts/01-create-schema.sql
psql "your_neon_database_connection_string" -f scripts/02-seed-data.sql
```


3. **Important Note on Passwords:** The `02-seed-data.sql` script contains pre-hashed passwords. If you encounter login issues, it might be due to `bcryptjs` generating slightly different hashes in your local environment versus where the seed hashes were generated. If this happens, you may need to:

1. Temporarily add a logging function in `lib/auth.ts` to generate a hash for a known password (e.g., `admin123`).
2. Log this hash.
3. Update the `password_hash` in the `users` table in your Neon database for the respective user with this newly generated hash.
4. Remove the temporary logging function.






6. **Run the Development Server:**

```shellscript
npm run dev
# or
yarn dev
```


7. **Access the Application:**
Open your web browser and navigate to `http://localhost:3000`. You should see the EDMS CLI interface.


## Using the CLI

The application presents a web-based terminal.

- Click into the input area at the bottom of the terminal to start typing commands.
- Type `help` to see a list of available commands.
- **Initial Login:** You can log in using the demo credentials provided in the seed data:

- Admin: `login admin admin123`
- Librarian: `login librarian librarian123`
- User: `login jdoe password123` (or `asmith password123`, `bwilson password123`)





## Available Commands

Here's a list of commands you can use in the CLI:

# ```
Available Commands:

Authentication:
login `<username>` `<password>`    - Login to the system
register                       - (Currently informational) Register a new user account
logout                         - Logout from the system
profile                        - View user profile and borrowing history

Book Management:
search `<query>` [category]      - Search for books by title, author, or ISBN
list [category]                - List all books or books by category
borrow `<book_id>` [days]        - Borrow a book (default: 14 days)
return `<borrowing_id>`          - Return a borrowed book
history                        - View borrowing history

System:
status                         - Show system status
help                           - Show this help message
clear                          - Clear the screen
```

## User Roles and Permissions

The system defines three user roles: `user`, `librarian`, and `admin`.

**Current Implementation:**
As of now, all logged-in users (regardless of their defined role) have access to the same set of CLI commands listed above. The distinction between roles is primarily in the database schema and is foundational for future enhancements.

**All logged-in users (User, Librarian, Admin) can:**

- **`profile`**: View their own profile and borrowing history.
- **`search <query> [category]`**: Search for books.
- **`list [category]`**: List books.
- **`borrow <book_id> [days]`**: Borrow an available book.
- **`return <borrowing_id>`**: Return a borrowed book.
- **`history`**: View their own borrowing history.
- **`status`**: View system status.
- **`logout`**: Log out of the system.


**Intended Future Capabilities (Not Yet Implemented in CLI):**

- **User:**

- Primarily focused on searching, borrowing, and returning resources for personal use.



- **Librarian:**

- All `user` capabilities.
- Manage the book catalog: add new books, edit existing book details, delete books.
- Manage book categories.
- View all borrowing records system-wide.
- Potentially manage overdue notices and fines.



- **Admin:**

- All `librarian` capabilities.
- Manage user accounts: create, edit, delete users, change user roles, reset passwords.
- View and manage system-wide audit logs.
- Configure system settings.
- Perform database maintenance tasks.





To implement these role-specific capabilities, further development is needed to:

1. Add new commands to the `command-processor.tsx`.
2. Create corresponding API endpoints in the `app/api/` directory.
3. Implement strict Role-Based Access Control (RBAC) within these API endpoints to verify the user's role before allowing an action.


---

Happy Hacking!
```

You can copy and paste this directly into a `README.md` file in your project's root directory. Remember to replace `<your-repository-url>` and `<repository-folder-name>` with your actual project details.

```plaintext


<Actions>
  <Action name="Add a 'Troubleshooting' section to README" description="Include common issues and solutions, like the bcrypt hash mismatch." />
  <Action name="Explain how to deploy to Vercel" description="Add a section on deploying the Next.js app to Vercel." />
  <Action name="Detail the database schema in the README" description="Provide an overview or link to the schema for better understanding." />
  <Action name="Start implementing Admin-specific commands" description="Begin building out distinct functionalities for the Admin role." />
</Actions>

```