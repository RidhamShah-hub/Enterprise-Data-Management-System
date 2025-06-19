# 🏢 Enterprise Data Management System (EDMS) CLI

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A modern, terminal-based interface for enterprise resource management**

[🚀 Live Demo](#) | [📖 Documentation](#) | [🐛 Report Bug](#) | [💡 Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [CLI Commands](#-cli-commands)
- [User Roles](#-user-roles-and-permissions)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

The **Enterprise Data Management System (EDMS)** is a Next.js application that provides a powerful command-line interface for managing users, books/resources, and borrowing records in an enterprise environment. Built with modern web technologies, it offers secure authentication, role-based access control, and an intuitive terminal-like experience.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖥️ **CLI Interface** | Terminal-based interaction with familiar command syntax |
| 🔒 **Secure Auth** | bcrypt password hashing with session management |
| 📚 **Resource Management** | Search, list, borrow, and return books/resources |
| 👤 **User Profiles** | Detailed user information and borrowing history |
| 🗄️ **Database Integration** | Neon serverless PostgreSQL for scalable storage |
| 📝 **Audit Logging** | Comprehensive activity tracking system |
| 🎭 **Role-Based Access** | Admin, Librarian, and User permission levels |

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

</td>
<td>

**Backend**
- Next.js API Routes
- Neon PostgreSQL
- bcryptjs
- SQL Scripts

</td>
</tr>
</table>

## 📋 Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) `v18.x` or later
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Neon](https://neon.tech/) account (free tier available)

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-username/enterprise-data-management-system.git
cd enterprise-data-management-system

# Install dependencies
npm install
# or
yarn install
```

### 2. Database Setup

1. **Create Neon Project:**
   - Visit [Neon Console](https://neon.tech/)
   - Create a new project
   - Copy your connection string

2. **Environment Configuration:**
   ```bash
   # Create .env.local file
   touch .env.local
   ```
   
   Add your database URL:
   ```env
   DATABASE_URL="postgresql://username:password@hostname/database"
   ```

### 3. Initialize Database

**Option A: Using Neon SQL Editor**
1. Open Neon Console → SQL Editor
2. Copy and run `scripts/01-create-schema.sql`
3. Copy and run `scripts/02-seed-data.sql`

**Option B: Using psql**
```bash
psql $DATABASE_URL -f scripts/01-create-schema.sql
psql $DATABASE_URL -f scripts/02-seed-data.sql
```

### 4. Launch Application

```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:3000` 🎉

---

## 💻 CLI Commands

### Authentication Commands

```bash
login <username> <password>    # Login to the system
register                       # Register new user (info only)
logout                         # Logout from system
profile                        # View user profile & history
```

### Resource Management

```bash
search <query> [category]      # Search books by title/author/ISBN
list [category]                # List all books or by category
borrow <book_id> [days]        # Borrow book (default: 14 days)
return <borrowing_id>          # Return borrowed book
history                        # View borrowing history
```

### System Commands

```bash
status                         # Show system status
help                           # Display help message
clear                          # Clear terminal screen
```

### 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| 👑 Admin | `admin` | `admin123` |
| 📚 Librarian | `librarian` | `librarian123` |
| 👤 User | `jdoe` | `password123` |
| 👤 User | `asmith` | `password123` |
| 👤 User | `bwilson` | `password123` |

---

## 🎭 User Roles and Permissions

### Current Implementation
All authenticated users have access to the same CLI commands, with role-based restrictions planned for future releases.

<details>
<summary>📊 <strong>Permission Matrix</strong></summary>

| Command | User | Librarian | Admin |
|---------|------|-----------|-------|
| `profile` | ✅ | ✅ | ✅ |
| `search` | ✅ | ✅ | ✅ |
| `list` | ✅ | ✅ | ✅ |
| `borrow` | ✅ | ✅ | ✅ |
| `return` | ✅ | ✅ | ✅ |
| `history` | ✅ | ✅ | ✅ |
| `status` | ✅ | ✅ | ✅ |

</details>

### 🚧 Planned Role Features

<details>
<summary><strong>Future Capabilities</strong></summary>

**👑 Admin**
- User management (create, edit, delete, role changes)
- System-wide audit log access
- Database maintenance tools
- Global system configuration

**📚 Librarian**
- Book catalog management (add, edit, delete)
- Category management
- System-wide borrowing records
- Overdue notices and fines

**👤 User**
- Personal resource browsing and borrowing
- Profile management
- Personal borrowing history

</details>

---

## 🌐 API Endpoints

<details>
<summary><strong>Authentication APIs</strong></summary>

```
POST /api/auth/login     # User authentication
POST /api/auth/register  # User registration
POST /api/auth/logout    # Session termination
```

</details>

<details>
<summary><strong>Resource APIs</strong></summary>

```
GET    /api/books        # List/search books
POST   /api/books/borrow # Borrow a book
POST   /api/books/return # Return a book
GET    /api/user/profile # User profile data
```

</details>

---

## 🗄️ Database Schema

<details>
<summary><strong>Core Tables</strong></summary>

**Users Table**
- `user_id`, `username`, `email`, `password_hash`, `role`, `created_at`

**Books Table**
- `book_id`, `title`, `author`, `isbn`, `category`, `status`, `created_at`

**Borrowings Table**
- `borrowing_id`, `user_id`, `book_id`, `borrowed_at`, `due_date`, `returned_at`

**Audit Logs Table**
- `log_id`, `user_id`, `action`, `details`, `timestamp`

</details>

---

## 🚀 Deployment

### Deploy to Vercel

1. **Connect Repository:**
   ```bash
   vercel --prod
   ```

2. **Environment Variables:**
   Add `DATABASE_URL` in Vercel dashboard

3. **Database Migration:**
   Run schema scripts against production database

### Deploy to Other Platforms

<details>
<summary><strong>Railway, Netlify, or Custom Server</strong></summary>

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables
3. Run database migrations
4. Start the production server:
   ```bash
   npm start
   ```

</details>

---

## 🔧 Troubleshooting

<details>
<summary><strong>Common Issues & Solutions</strong></summary>

### ❌ Login Issues (Invalid Credentials)

**Problem:** bcrypt hash mismatch between environments

**Solution:**
1. Temporarily add logging to `lib/auth.ts`:
   ```typescript
   console.log('Generated hash:', await bcrypt.hash('admin123', 12));
   ```
2. Update database with new hash
3. Remove logging code

### ❌ Database Connection Errors

**Problem:** Cannot connect to Neon database

**Solutions:**
- Verify `DATABASE_URL` format
- Check Neon project status
- Ensure database exists and is accessible

### ❌ Missing Dependencies

**Problem:** Module not found errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

</details>

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/your-username/enterprise-data-management-system.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Neon](https://neon.tech/) for serverless PostgreSQL
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Ridham Shah](https://github.com/RidhamShah-hub)

</div>