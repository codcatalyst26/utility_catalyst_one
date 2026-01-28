import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { textSchema } from "@/lib/validation";
import { useSessionState } from "@/hooks/useSessionState";

interface TextFormProps {
  onDataChange: (data: string) => void;
}

export function TextForm({ onDataChange }: TextFormProps) {
  const [text, setText] = useSessionState<string>("qr_text_data", "");
  const [error, setError] = useState("");

  /** 🔹 Re-emit QR data on refresh or state restore */
  useEffect(() => {
    if (!text.trim()) {
      setError("");
      onDataChange("");
      return;
    }

    const result = textSchema.safeParse(text);
    if (result.success) {
      setError("");
      onDataChange(text);
    } else {
      setError(result.error.errors[0]?.message || "Invalid text");
      onDataChange("");
    }
  }, [text, onDataChange]);

  const handleChange = (value: string) => {
    setText(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <FileText className="h-5 w-5 text-primary" />
        Text to QR Code
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="text-input">Your Text</Label>
          <span className="text-xs text-muted-foreground">
            {text.length}/2000
          </span>
        </div>

        <Textarea
          id="text-input"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          className={`min-h-[120px] resize-y ${
            error ? "border-destructive" : ""
          }`}
          maxLength={2000}
        />

        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Enter any text up to 2000 characters
      </p>
    </div>
  );
}
