import type { ComponentType } from 'react'

export type NavigationItem = {
  path: string
  title: string
  description: string
  icon: ComponentType<{ size: number; strokeWidth: number }>
}
