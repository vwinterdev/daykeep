import { useLayoutEffect, useRef } from 'react'

export const useScrollReset = (path: string) => {
  const main = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (main.current) main.current.scrollTop = 0
  }, [path])
  return main
}
