import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Root = forwardRef<
  ElementRef<'select'>,
  ComponentPropsWithoutRef<'select'>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        'rounded-2xl border-none border-gray-300 bg-gray-200 px-7 py-3 text-[15px] font-semibold text-black outline-none transition-colors duration-200 hover:border-gray-600 hover:bg-white focus-visible:border-gray-600 focus-visible:bg-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-200',
        className,
      )}
      {...props}
    />
  )
})

export const Option = forwardRef<
  ElementRef<'option'>,
  ComponentPropsWithoutRef<'option'>
>(({ className, ...props }, ref) => {
  return (
    <option
      ref={ref}
      className={cn('bg-white text-xl', className)}
      {...props}
    />
  )
})
