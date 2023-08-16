import {
  ComponentPropsWithoutRef,
  ElementRef,
  ReactNode,
  forwardRef,
} from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  children: ReactNode
  asChild?: boolean
}

export const Button = forwardRef<ElementRef<'button'>, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(
          'rounded border border-black bg-white px-2 py-1 uppercase text-black outline-none transition-colors duration-200 hover:bg-gray-200 hover:text-black focus-visible:bg-gray-200',
          className,
        )}
        {...props}
      />
    )
  },
)
