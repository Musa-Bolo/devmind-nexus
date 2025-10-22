import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { InputArea } from "./InputArea";
import { ModeSelector } from "./ModeSelector";
import { useToast } from "@/hooks/use-toast";

export type MessageRole = "user" | "assistant";
export type Mode = "text" | "code" | "image";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  mode?: Mode;
  language?: string;
  imageUrl?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm DevMind, your AI coding assistant. I can help you with:\n\n• **Text Generation** - Explanations, documentation, technical writing\n• **Code Generation** - Python, JavaScript, C++, Java, PHP, HTML, CSS and more\n• **Image Generation** - Diagrams, illustrations, and visual content\n\nSelect a mode below and let's build something amazing!",
      mode: "text"
    }
  ]);
  const [mode, setMode] = useState<Mode>("text");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string, language?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      mode,
      language
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/devmind-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message: content,
          mode,
          language: language || (mode === "code" ? "javascript" : undefined),
          history: messages.slice(-6)
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.code || "",
        mode,
        language: language || (mode === "code" ? "javascript" : undefined),
        imageUrl: data.imageUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-xl font-bold text-background">DM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DevMind
                </h1>
                <p className="text-xs text-muted-foreground">AI Coding Assistant</p>
              </div>
            </div>
            <ModeSelector mode={mode} onModeChange={setMode} />
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-card border border-border rounded-2xl px-4 py-3 max-w-[80%]">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-100" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <InputArea
        onSend={handleSendMessage}
        disabled={isLoading}
        mode={mode}
      />
    </div>
  );
};