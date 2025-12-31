import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { emailSchema, type EmailInput } from '@/lib/validation';
import { formatEmailData } from '@/lib/qr-utils';

interface EmailFormProps {
  onDataChange: (data: string) => void;
}

export function EmailForm({ onDataChange }: EmailFormProps) {
  const [formData, setFormData] = useState<EmailInput>({
    email: '',
    subject: '',
    body: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof EmailInput, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (!newData.email.trim()) {
      setErrors({});
      onDataChange('');
      return;
    }

    const result = emailSchema.safeParse(newData);
    if (result.success) {
      setErrors({});
      onDataChange(formatEmailData(newData));
    } else {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      onDataChange('');
    }
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
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject-input">Subject (optional)</Label>
          <Input
            id="subject-input"
            type="text"
            placeholder="Email subject"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={errors.subject ? 'border-destructive' : ''}
          />
          {errors.subject && (
            <p className="text-sm text-destructive animate-fade-in">{errors.subject}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="body-input">Body (optional)</Label>
          <Textarea
            id="body-input"
            placeholder="Email body text..."
            value={formData.body}
            onChange={(e) => handleChange('body', e.target.value)}
            className={`min-h-[80px] ${errors.body ? 'border-destructive' : ''}`}
          />
          {errors.body && (
            <p className="text-sm text-destructive animate-fade-in">{errors.body}</p>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Generates a mailto: QR code that opens an email client
      </p>
    </div>
  );
}
