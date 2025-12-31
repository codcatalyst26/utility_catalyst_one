import { z } from 'zod';

export const urlSchema = z.string().url('Please enter a valid URL').min(1, 'URL is required');

export const textSchema = z.string().min(1, 'Text is required').max(2000, 'Text must be less than 2000 characters');

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().max(200, 'Subject must be less than 200 characters').optional(),
  body: z.string().max(1000, 'Body must be less than 1000 characters').optional(),
});

export const phoneSchema = z.object({
  countryCode: z.string().min(1, 'Country code is required'),
  number: z.string().min(5, 'Phone number is too short').max(15, 'Phone number is too long')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
});

export const vcardSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  company: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type UrlInput = z.infer<typeof urlSchema>;
export type TextInput = z.infer<typeof textSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
export type VCardInput = z.infer<typeof vcardSchema>;
