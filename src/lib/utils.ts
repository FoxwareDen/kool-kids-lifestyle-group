import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

import * as Icons from "lucide-react";
import type { LucideIcon } from 'lucide-react'

import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mapIcon = (iconName: string): LucideIcon => {
    return (Icons[iconName as keyof typeof Icons] as LucideIcon) ?? Icons.CircleHelp;  
} 