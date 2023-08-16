import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Root = forwardRef<
  ElementRef<'table'>,
  ComponentPropsWithoutRef<'table'>
>(({ className, ...props }, ref) => {
  return (
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  )
})

export const Header = forwardRef<
  ElementRef<'thead'>,
  ComponentPropsWithoutRef<'thead'>
>(({ className, ...props }, ref) => {
  return <thead ref={ref} className={cn(className)} {...props} />
})

export const Body = forwardRef<
  ElementRef<'tbody'>,
  ComponentPropsWithoutRef<'tbody'>
>(({ className, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
})

export const Row = forwardRef<ElementRef<'tr'>, ComponentPropsWithoutRef<'tr'>>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b bg-muted/10 transition-colors hover:bg-gray-200',
          className,
        )}
        {...props}
      />
    )
  },
)

export const Cell = forwardRef<
  ElementRef<'td'>,
  ComponentPropsWithoutRef<'td'>
>(({ className, ...props }, ref) => {
  return <td ref={ref} className={cn('align-middle', className)} {...props} />
})

export const Head = forwardRef<
  ElementRef<'th'>,
  ComponentPropsWithoutRef<'th'>
>(({ className, ...props }, ref) => {
  return (
    <th
      ref={ref}
      className={cn('h-12 px-4 text-left align-middle font-medium', className)}
      {...props}
    />
  )
})
