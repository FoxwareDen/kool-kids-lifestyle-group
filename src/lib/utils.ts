import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

import * as Icons from "lucide-react";
import type { LucideIcon } from 'lucide-react'

import { twMerge } from 'tailwind-merge'
import type { Language, Translatable } from './experiences';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapIcon = (iconName: string): LucideIcon => {
    return (Icons[iconName as keyof typeof Icons] as LucideIcon) ?? Icons.CircleHelp;  
} 

export function formatDateForInput(dateString: string): string {
  // If it's already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Otherwise, parse and format it
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
}

export function setTranslated<T>(field: Translatable<T>, lang: Language, value: T): Translatable<T> {
  if (lang === 'en') return { ...field, default: value }
  return { ...field, translations: { ...field.translations, [lang]: value } }
}
 