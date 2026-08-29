import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, MessageSquare, X, Send, Bot, User, ChevronRight, Ticket } from "lucide-react"
import { Link } from "wouter"
import { cn } from "@/lib/utils"

interface ChatMessage {
  id: string
  sender: "user" | "bot"
  text: string
  suggestedEvents?: any[]
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi! I'm CampusBot, your Smart Campus Assistant. Ask me anything about upcoming events, clubs, registrations, or certificates!"
    }
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query })
      })

      if (!res.ok) throw new Error("Failed to reach AI service")

      const data = await res.json()

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "I've processed your query.",
        suggestedEvents: data.suggestedEvents || []
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Sorry, I ran into an issue looking that up. Please try again shortly!"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 rounded-full shadow-lg bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-primary-foreground font-semibold flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span>Ask CampusBot</span>
        </Button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <Card className="w-[360px] sm:w-[400px] h-[520px] shadow-2xl flex flex-col border-primary/20 bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-primary to-teal-600 text-primary-foreground p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-bold leading-tight">CampusBot AI</CardTitle>
                <p className="text-xs text-white/80">Smart Campus Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages Feed */}
          <CardContent ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex gap-2 max-w-[85%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5",
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      "p-3 rounded-2xl leading-relaxed text-sm shadow-2xs",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted/80 text-foreground rounded-tl-none border"
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Event Cards */}
                  {msg.suggestedEvents && msg.suggestedEvents.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {msg.suggestedEvents.map((evt) => (
                        <Link
                          key={evt.id}
                          href={`/events/${evt.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block p-2 rounded-lg border bg-background hover:border-primary transition-colors group"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="truncate group-hover:text-primary transition-colors">{evt.title}</span>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Ticket className="h-3 w-3" /> {evt.category}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <Bot className="h-4 w-4 animate-bounce" /> CampusBot is thinking...
              </div>
            )}
          </CardContent>

          {/* Quick Prompts */}
          <div className="px-4 py-1.5 border-t bg-muted/20 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend("Upcoming events this week")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-muted text-muted-foreground whitespace-nowrap transition-colors"
            >
              📅 Events this week
            </button>
            <button
              onClick={() => handleSend("How to get certificates?")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-muted text-muted-foreground whitespace-nowrap transition-colors"
            >
              🎓 Certificates info
            </button>
            <button
              onClick={() => handleSend("Which clubs are recruiting?")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-muted text-muted-foreground whitespace-nowrap transition-colors"
            >
              👥 Club recruitments
            </button>
          </div>

          {/* Input Footer */}
          <CardFooter className="p-3 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                placeholder="Ask CampusBot..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-10 text-sm rounded-full bg-muted/30 focus-visible:ring-primary"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || loading} className="h-10 w-10 rounded-full shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
