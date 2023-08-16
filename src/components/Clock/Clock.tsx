import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'

export interface ClockProps extends ComponentPropsWithoutRef<'span'> {
  options: Intl.DateTimeFormatOptions
  locales: Intl.LocalesArgument
}

export function Clock({ options, locales, ...props }: ClockProps) {
  const timeRef = useRef<NodeJS.Timer>()
  const [time, setTime] = useState(new Date())

  const timeFormatted = time.toLocaleTimeString(locales, options)

  useEffect(() => {
    timeRef.current = setInterval(() => setTime(new Date()), 1000)

    return () => {
      clearInterval(timeRef.current)
    }
  }, [])

  return <span {...props}>{timeFormatted}</span>
}
