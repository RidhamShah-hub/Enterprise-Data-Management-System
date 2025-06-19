"use client"

import { useState, useEffect } from "react"
import { CLIInterface } from "@/components/cli-interface"
import { CommandProcessor } from "@/components/command-processor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Terminal, Users, BookOpen, Activity } from "lucide-react"

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

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [commandProcessor, setCommandProcessor] = useState<CommandProcessor | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus()
  }, [])

  useEffect(() => {
    setCommandProcessor(new CommandProcessor(user))
  }, [user])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      }
    } catch (error) {
      // User not logged in
    }
  }

  const handleCommand = async (command: string): Promise<string> => {
    if (!commandProcessor) {
      return "Error: System not initialized"
    }

    const result = await commandProcessor.processCommand(command)

    // Check if login was successful and update user state
    if (command.startsWith("login") && result.includes("Success: Logged in")) {
      await checkAuthStatus()
    }

    // Check if logout was successful and update user state
    if (command === "logout" && result.includes("Success: Logged out")) {
      setUser(null)
    }

    return result
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Enterprise Data Management System</h1>
          <p className="text-xl text-gray-600">Secure Command-Line Interface for Enterprise Data Operations</p>
          {user && (
            <Badge variant="secondary" className="text-sm">
              Logged in as {user.firstName} {user.lastName} ({user.role})
            </Badge>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm font-medium ml-2">Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Multi-factor authentication with role-based access control and session management
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Database className="h-4 w-4 text-green-600" />
              <CardTitle className="text-sm font-medium ml-2">SQL Injection Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Parameterized queries and input validation to prevent SQL injection attacks
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Terminal className="h-4 w-4 text-purple-600" />
              <CardTitle className="text-sm font-medium ml-2">CLI Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Powerful command-line interface for efficient data management operations
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Users className="h-4 w-4 text-orange-600" />
              <CardTitle className="text-sm font-medium ml-2">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive user profiles with borrowing history and activity tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <BookOpen className="h-4 w-4 text-red-600" />
              <CardTitle className="text-sm font-medium ml-2">Resource Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced search, borrowing, and return functionality with real-time availability
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <Activity className="h-4 w-4 text-teal-600" />
              <CardTitle className="text-sm font-medium ml-2">Audit Logging</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Comprehensive activity logging and data integrity validation mechanisms</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CLI Interface */}
        <CLIInterface onCommand={handleCommand} user={user} />

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with the Enterprise Data Management System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Authentication Commands:</h4>
                <div className="space-y-1 text-sm font-mono bg-gray-100 p-2 rounded">
                  <div>login &lt;username&gt; &lt;password&gt;</div>
                  <div>register</div>
                  <div>logout</div>
                  <div>profile</div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Book Management Commands:</h4>
                <div className="space-y-1 text-sm font-mono bg-gray-100 p-2 rounded">
                  <div>search &lt;query&gt; [category]</div>
                  <div>list [category]</div>
                  <div>borrow &lt;book_id&gt; [days]</div>
                  <div>return &lt;borrowing_id&gt;</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Demo Credentials:</strong> Use username "admin" with password "admin123" or "librarian" with
              password "librarian123" to test the system.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
