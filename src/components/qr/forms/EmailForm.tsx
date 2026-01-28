import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { emailSchema, type EmailInput } from "@/lib/validation";
import { formatEmailData } from "@/lib/qr-utils";
import { useSessionState } from "@/hooks/useSessionState";

interface EmailFormProps {
  onDataChange: (data: string) => void;
}

const EMPTY_FORM: EmailInput = {
  email: "",
  subject: "",
  body: "",
};

export function EmailForm({ onDataChange }: EmailFormProps) {
  const [formData, setFormData] = useSessionState<EmailInput>(
    "qr_email_data",
    EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** 🔹 Re-emit QR data after refresh or restore */
  useEffect(() => {
    if (!formData.email.trim()) {
      setErrors({});
      onDataChange("");
      return;
    }

    const result = emailSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      onDataChange(formatEmailData(formData));
    } else {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      onDataChange("");
    }
  }, [formData, onDataChange]);

  const handleChange = (field: keyof EmailInput, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Mail className="h-5 w-5 text-primary" />
        Email to QR Code
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-input">Email Address *</Label>
          <Input
            id="email-input"
            type="email"
            placeholder="recipient@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive animate-fade-in">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject-input">Subject (optional)</Label>
          <Input
            id="subject-input"
            type="text"
            placeholder="Email subject"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className={errors.subject ? "border-destructive" : ""}
          />
          {errors.subject && (
            <p className="text-sm text-destructive animate-fade-in">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="body-input">Body (optional)</Label>
          <Textarea
            id="body-input"
            placeholder="Email body text..."
            value={formData.body}
            onChange={(e) => handleChange("body", e.target.value)}
            className={`min-h-[80px] ${
              errors.body ? "border-destructive" : ""
            }`}
          />
          {errors.body && (
            <p className="text-sm text-destructive animate-fade-in">
              {errors.body}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Generates a mailto: QR code that opens an email client
      </p>
    </div>
  );
}
