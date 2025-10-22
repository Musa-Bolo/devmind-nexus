import { Message } from "./ChatInterface";
import { CodeBlock } from "./CodeBlock";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}>
      <div
        className={`rounded-2xl px-4 py-3 max-w-[80%] transition-all duration-300 hover:scale-[1.02] ${
          isUser
            ? "bg-gradient-to-br from-primary to-secondary text-background shadow-glow"
            : "bg-card border border-border"
        }`}
      >
        {message.mode === "code" && !isUser ? (
          <CodeBlock
            code={message.content}
            language={message.language || "javascript"}
          />
        ) : message.imageUrl ? (
          <div className="space-y-2">
            {message.content && (
              <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
            )}
            <img
              src={message.imageUrl}
              alt="Generated"
              className="rounded-lg max-w-full h-auto border border-border animate-scale-in shadow-lg hover:shadow-glow transition-all duration-300"
            />
          </div>
        ) : (
          <p className={`text-sm whitespace-pre-wrap ${isUser ? "text-background" : "text-foreground"}`}>
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
};