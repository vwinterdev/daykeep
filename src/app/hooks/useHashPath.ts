import { useSyncExternalStore } from 'react'
import { RoutePath } from '@/app/enums/RoutePath'

const subscribe = (listener: () => void): (() => void) => {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}

const getPath = (): string => window.location.hash.slice(1) || RoutePath.Overview

export const useHashPath = (): string => useSyncExternalStore(subscribe, getPath)
