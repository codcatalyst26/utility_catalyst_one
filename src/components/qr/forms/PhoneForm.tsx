import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { phoneSchema, type PhoneInput } from "@/lib/validation";
import { formatPhoneData, countryCodes } from "@/lib/qr-utils";
import { useSessionState } from "@/hooks/useSessionState";

interface PhoneFormProps {
  onDataChange: (data: string) => void;
}

const EMPTY_FORM: PhoneInput = {
  countryCode: "+1",
  number: "",
};

export function PhoneForm({ onDataChange }: PhoneFormProps) {
  const [formData, setFormData] = useSessionState<PhoneInput>(
    "qr_phone_data",
    EMPTY_FORM,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** 🔹 Re-emit QR data after refresh or restore */
  useEffect(() => {
    if (!formData.number.trim()) {
      setErrors({});
      onDataChange("");
      return;
    }

    const result = phoneSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      onDataChange(formatPhoneData(formData));
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

  const handleChange = (field: keyof PhoneInput, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Phone className="h-5 w-5 text-primary" />
        Phone to QR Code
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Country Code</Label>
          <Select
            value={formData.countryCode}
            onValueChange={(value) => handleChange("countryCode", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((cc) => (
                <SelectItem key={cc.code} value={cc.code}>
                  {cc.code} ({cc.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-input">Phone Number</Label>
          <Input
            id="phone-input"
            type="tel"
            placeholder="1234567890"
            value={formData.number}
            onChange={(e) =>
              handleChange("number", e.target.value.replace(/\D/g, ""))
            }
            className={errors.number ? "border-destructive" : ""}
          />
          {errors.number && (
            <p className="text-sm text-destructive animate-fade-in">
              {errors.number}
            </p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Generates a tel: QR code that initiates a phone call
      </p>
    </div>
  );
}
