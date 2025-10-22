import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { Mode } from "./ChatInterface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputAreaProps {
  onSend: (message: string, language?: string) => void;
  disabled?: boolean;
  mode: Mode;
}

export const InputArea = ({ onSend, disabled, mode }: InputAreaProps) => {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("javascript");

  const languages = [
    "javascript",
    "python",
    "java",
    "cpp",
    "php",
    "html",
    "css",
    "typescript",
    "go",
    "rust",
  ];

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim(), mode === "code" ? language : undefined);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPlaceholder = () => {
    switch (mode) {
      case "code":
        return "What awesome code should I write? 💻";
      case "image":
        return "Describe something cool to visualize! 🎨";
      default:
        return "What's on your mind? 💭";
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {mode === "code" && (
          <div className="mb-3">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none bg-background border-border focus:border-primary transition-colors"
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px] bg-gradient-to-br from-primary to-secondary hover:shadow-glow hover:scale-110 transition-all duration-300"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};