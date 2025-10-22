import { Mode } from "./ChatInterface";
import { Button } from "@/components/ui/button";
import { MessageSquare, Code2, Image } from "lucide-react";

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  const modes: { value: Mode; label: string; icon: typeof MessageSquare }[] = [
    { value: "text", label: "Text", icon: MessageSquare },
    { value: "code", label: "Code", icon: Code2 },
    { value: "image", label: "Image", icon: Image },
  ];

  return (
    <div className="flex gap-1 bg-muted rounded-lg p-1">
      {modes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={mode === value ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange(value)}
          className={`gap-2 transition-all duration-300 ${
            mode === value
              ? "bg-gradient-to-r from-primary to-secondary text-background shadow-glow scale-105"
              : "hover:bg-card hover:scale-105"
          }`}
        >
          <Icon className={`h-4 w-4 ${mode === value ? "animate-bounce" : ""}`} />
          {label}
        </Button>
      ))}
    </div>
  );
};