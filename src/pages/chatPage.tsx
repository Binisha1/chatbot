import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import LogOut from "./logout";

import Markdown from "markdown-to-jsx";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://chatapp-fastapi.vercel.app/chat-stream/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";

      setMessages((prev) => [...prev, { role: "bot", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const cleanChunk = chunk.replace(/data:\s*/, "").trim();
        if (!cleanChunk) continue;

        botResponse += cleanChunk;

        // Update the last bot message in state properly
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 && msg.role === "bot"
              ? { ...msg, content: botResponse }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setLoading(false);
    }
  };

  const ExtractedContent = ({ content }: { content: string }) => {
    const startIndex = content.indexOf("Extracting links...");
    const endIndex = content.indexOf("Extraction complete!");

    if (startIndex === -1 || endIndex === -1) {
      // If either phrase is missing, render content normally
      return <Markdown>{content}</Markdown>;
    }

    // Ensure we include "Extraction complete!" fully
    const extractedEndIndex = endIndex + "Extraction complete!".length;

    const before = content.substring(0, startIndex);
    const extractedPart = content.substring(startIndex, extractedEndIndex);
    const after = content.substring(extractedEndIndex);

    return (
      <div className="prose prose-sm max-w-none">
        {before && <Markdown>{before}</Markdown>}

        {/* Apply background only to the correct section */}
        {extractedPart && (
          <div className="bg-gray-200 p-4 rounded-lg">
            <Markdown>{extractedPart}</Markdown>
          </div>
        )}

        {after && <Markdown>{after}</Markdown>}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between md:pt-5 px-1 lg:px-5">
      <h1 className="hidden lg:flex text-xl font-semibold text-primary">
        Chat With Gemini
      </h1>
      <header className="lg:hidden border-b py-1 pl-2 sticky top-0 z-10">
        <div className="flex items-center justify-between  mx-auto">
          <h1 className="text-xl font-semibold text-primary">
            Chat With Gemini
          </h1>
          <div>
            <LogOut />
          </div>
        </div>
      </header>

      <div className="flex flex-col h-screen w-full lg:w-3/5 mx-auto">
        {/* Chat container */}
        <div className="flex-1 overflow-hidden  w-full mx-auto px-4 py-1 lg:py-4">
          <ScrollArea className="h-full  pr-5">
            <div className="space-y-6 pb-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                  <Bot className="h-16 w-16 text-primary/20 mb-4" />
                  <h3 className="text-xl font-medium text-primary">
                    How can I help you today?
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Ask me anything and I'll do my best to assist you.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-3 max-w-3xl",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground order-last"
                          : "bg-muted text-foreground"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-lg px-4 py-3 max-w-[85%]",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 border border-border/50"
                      )}
                    >
                      {msg.content ? (
                        <div className="prose prose-sm  max-w-none">
                          {/* <ReactMarkdown>{msg.content}</ReactMarkdown> */}
                          <ExtractedContent content={msg.content} />
                          {/* <Markdown>{msg.content}</Markdown> */}
                          {/* convert({msg.content}) */}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-6">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input area */}
        <div className=" p-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="pr-20 py-6 bg-background border-black border-2 focus:outline-none focus:ring-0 focus:border-black"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage()
                }
              />
              <Button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                size="icon"
                className="absolute bg-black right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 bg-black " />
                )}
              </Button>
            </div>
            <p className="text-xs text-center opacity-50 mt-2">
              Press Enter to send
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-start">
        <LogOut />
      </div>
    </div>
  );
}
