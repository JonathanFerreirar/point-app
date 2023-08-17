import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Input = forwardRef<
  ElementRef<'input'>,
  ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'rounded-xl border-2 border-gray-300 bg-gray-200 px-5 py-3 text-sm text-black outline-none transition-colors duration-200 hover:border-gray-600 hover:bg-white focus-visible:border-gray-600 focus-visible:bg-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200',
        className,
      )}
      {...props}
    />
  )
})
