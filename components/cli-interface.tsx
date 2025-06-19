"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CLIOutput {
  type: "command" | "output" | "error" | "success"
  content: string
  timestamp: Date
}

interface CLIInterfaceProps {
  onCommand: (command: string) => Promise<string>
  prompt?: string
  user?: any
}

export function CLIInterface({ onCommand, prompt = "$", user }: CLIInterfaceProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<CLIOutput[]>([
    {
      type: "success",
      content: "Enterprise Data Management System v1.0.0",
      timestamp: new Date(),
    },
    {
      type: "output",
      content: 'Type "help" for available commands.',
      timestamp: new Date(),
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const command = input.trim()
    setInput("")
    setIsProcessing(true)

    // Add command to output
    setOutput((prev) => [
      ...prev,
      {
        type: "command",
        content: `${user?.username || "user"}@edms:~$ ${command}`,
        timestamp: new Date(),
      },
    ])

    try {
      const result = await onCommand(command)
      setOutput((prev) => [
        ...prev,
        {
          type: result.startsWith("Error:") ? "error" : "output",
          content: result,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      setOutput((prev) => [
        ...prev,
        {
          type: "error",
          content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const getOutputColor = (type: CLIOutput["type"]) => {
    switch (type) {
      case "command":
        return "text-blue-400"
      case "error":
        return "text-red-400"
      case "success":
        return "text-green-400"
      default:
        return "text-gray-300"
    }
  }

  return (
    <Card className="w-full h-[600px] bg-gray-900 border-gray-700 flex flex-col">
      <div className="h-full flex flex-col">
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm ml-4">Enterprise Data Management System</span>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 max-h-[400px] overflow-y-auto" ref={scrollRef}>
          <div className="space-y-1 font-mono text-sm">
            {output.map((item, index) => (
              <div key={index} className={getOutputColor(item.type)}>
                <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{item.content}</pre>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <span className="text-green-400 font-mono text-sm">{user?.username || "user"}@edms:~$</span>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-none text-gray-300 font-mono text-sm focus:ring-0 focus:outline-none"
              placeholder={isProcessing ? "Processing..." : "Enter command..."}
            />
          </form>
        </div>
      </div>
    </Card>
  )
}
