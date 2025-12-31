import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useEmissions } from "@/hooks/useEmissions";

// n8n webhook URL for the chatbot
const N8N_CHAT_WEBHOOK = "https://dgledhill.app.n8n.cloud/webhook/carbon-chat";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const ChatBot = () => {
  const { user } = useAuth();
  const { latestEmissions, getCategoryData } = useEmissions(user?.id);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "G'day! I'm your Carbon Emissions Assistant. I can help you with:\n\n• Understanding your emissions data\n• Tips to reduce your carbon footprint\n• NGERS reporting guidance\n• Sustainability strategies\n• Industry benchmarks\n\nWhat would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Build context about user's emissions for more relevant responses
  const buildEmissionsContext = () => {
    if (!latestEmissions) {
      return "No emissions data available yet.";
    }

    const categories = getCategoryData();
    const topEmitters = categories
      .filter(c => c.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map(c => `${c.name}: ${c.value.toFixed(2)} t CO2e`)
      .join(", ");

    return `
User's Latest Emissions Data:
- Total: ${latestEmissions.total_emissions?.toFixed(2) ?? 0} t CO2e
- Scope 1 (Direct): ${latestEmissions.scope1_total?.toFixed(2) ?? 0} t CO2e
- Scope 2 (Indirect): ${latestEmissions.scope2_total?.toFixed(2) ?? 0} t CO2e
- Scope 3 (Value Chain): ${latestEmissions.scope3_total?.toFixed(2) ?? 0} t CO2e
- Top emitters: ${topEmitters}
- Report period: ${latestEmissions.report_period || "Not specified"}
    `.trim();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const emissionsContext = buildEmissionsContext();

      const response = await fetch(N8N_CHAT_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          user_id: user?.id || null,
          context: {
            emissions_summary: emissionsContext,
            has_data: !!latestEmissions,
            total_emissions: latestEmissions?.total_emissions ?? null,
            scope1: latestEmissions?.scope1_total ?? null,
            scope2: latestEmissions?.scope2_total ?? null,
            scope3: latestEmissions?.scope3_total ?? null,
          },
          system_prompt: `You are a helpful Carbon Emissions Assistant for Australian businesses. You help users understand their carbon footprint, provide reduction strategies, and explain NGERS (National Greenhouse and Energy Reporting System) requirements.

Key guidelines:
1. Be friendly and use Australian English (e.g., "organisation" not "organization")
2. When discussing emissions, use tonnes CO2e (t CO2e) as the unit
3. Reference the user's actual emissions data when available
4. Provide actionable, practical advice for reducing emissions
5. Be concise but thorough - aim for helpful responses under 200 words
6. If asked about specific regulations, mention NGERS and Clean Energy Regulator guidelines
7. For reduction strategies, prioritise high-impact, cost-effective solutions

${emissionsContext}

Remember: Focus on being helpful, accurate, and actionable.`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't process that request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick action buttons
  const quickActions = [
    "How can I reduce my electricity emissions?",
    "What is Scope 1 vs Scope 2?",
    "Tips for reducing fleet emissions",
  ];

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          isOpen && "rotate-90"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300",
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-primary px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground">Carbon Assistant</h3>
            <p className="text-xs text-primary-foreground/70">
              {latestEmissions ? `Total: ${latestEmissions.total_emissions?.toFixed(1) ?? 0} t CO2e` : "Ask me anything about emissions"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-4 py-2">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}

            {/* Quick actions - show only at start */}
            {messages.length === 1 && !isLoading && (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-muted-foreground">Quick questions:</p>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(action);
                      handleSend();
                    }}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-foreground transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about emissions..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
