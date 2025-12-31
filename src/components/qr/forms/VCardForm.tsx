import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { vcardSchema, type VCardInput } from '@/lib/validation';
import { formatVCardData } from '@/lib/qr-utils';

interface VCardFormProps {
  onDataChange: (data: string) => void;
}

export function VCardForm({ onDataChange }: VCardFormProps) {
  const [formData, setFormData] = useState<VCardInput>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    company: '',
    title: '',
    address: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof VCardInput, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    if (!newData.firstName.trim()) {
      setErrors({});
      onDataChange('');
      return;
    }

    const result = vcardSchema.safeParse(newData);
    if (result.success) {
      setErrors({});
      onDataChange(formatVCardData(newData));
    } else {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as string;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      // Still generate if only optional fields have errors
      if (!newErrors.firstName) {
        onDataChange(formatVCardData(newData));
      } else {
        onDataChange('');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <User className="h-5 w-5 text-primary" />
        Contact (vCard) to QR Code
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName-input">First Name *</Label>
          <Input
            id="firstName-input"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={errors.firstName ? 'border-destructive' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive animate-fade-in">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName-input">Last Name</Label>
          <Input
            id="lastName-input"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vcard-phone-input">Phone</Label>
          <Input
            id="vcard-phone-input"
            type="tel"
            placeholder="+1234567890"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vcard-email-input">Email</Label>
          <Input
            id="vcard-email-input"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-input">Company</Label>
          <Input
            id="company-input"
            placeholder="Acme Inc."
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title-input">Job Title</Label>
          <Input
            id="title-input"
            placeholder="Software Engineer"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website-input">Website</Label>
          <Input
            id="website-input"
            type="url"
            placeholder="https://johndoe.com"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            className={errors.website ? 'border-destructive' : ''}
          />
          {errors.website && (
            <p className="text-sm text-destructive animate-fade-in">{errors.website}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address-input">Address</Label>
        <Textarea
          id="address-input"
          placeholder="123 Main St, City, Country"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="min-h-[60px]"
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        Generates a vCard QR code that can be saved to contacts
      </p>
    </div>
  );
}
