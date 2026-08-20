import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'w-full rounded-full px-6 py-3 text-base font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40',
        variant === 'primary' &&
          'bg-pip-primary text-white hover:enabled:bg-pip-primary-hover',
        variant === 'secondary' &&
          'bg-pip-secondary text-pip-text hover:enabled:bg-pip-secondary-hover',
        className,
      )}
      {...props}
    />
  )
}
