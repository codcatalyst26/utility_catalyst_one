import React, { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { urlSchema } from '@/lib/validation';

interface UrlFormProps {
  onDataChange: (data: string) => void;
}

export function UrlForm({ onDataChange }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleChange = (value: string) => {
    setUrl(value);
    
    if (!value.trim()) {
      setError('');
      onDataChange('');
      return;
    }

    const result = urlSchema.safeParse(value);
    if (result.success) {
      setError('');
      onDataChange(value);
    } else {
      setError(result.error.errors[0]?.message || 'Invalid URL');
      onDataChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <LinkIcon className="h-5 w-5 text-primary" />
        URL to QR Code
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url-input">Website URL</Label>
        <Input
          id="url-input"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          className={error ? 'border-destructive' : ''}
        />
        {error && (
          <p className="text-sm text-destructive animate-fade-in">{error}</p>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        Enter a valid URL starting with http:// or https://
      </p>
    </div>
  );
}
