// Custom hook for performance optimization across the app
import { useEffect, useCallback, useRef } from 'react'
import { PerformanceMonitor } from '@/utils/PerformanceMonitor'

interface UsePerformanceOptimizationOptions {
  enableCoreWebVitals?: boolean
  enableMetrics?: boolean
  debounceMs?: number
}

export const usePerformanceOptimization = (options: UsePerformanceOptimizationOptions = {}) => {
  const {
    enableCoreWebVitals = true,
    enableMetrics = true,
    debounceMs = 100
  } = options

  const rafId = useRef<number>()
  const timeoutId = useRef<NodeJS.Timeout>()

  // Optimized scroll handler with RAF
  const optimizedScrollHandler = useCallback((callback: () => void) => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      rafId.current = requestAnimationFrame(callback)
    }
  }, [])

  // Debounced function utility
  const debounce = useCallback(<T extends (...args: any[]) => void>(
    func: T,
    delay: number = debounceMs
  ): T => {
    return ((...args: Parameters<T>) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
      timeoutId.current = setTimeout(() => func(...args), delay)
    }) as T
  }, [debounceMs])

  // Measure component render time
  const measureRender = useCallback((componentName: string) => {
    return {
      start: () => enableMetrics && PerformanceMonitor.startMeasure(`render-${componentName}`),
      end: () => enableMetrics && PerformanceMonitor.endMeasure(`render-${componentName}`)
    }
  }, [enableMetrics])

  // Preload critical resources
  const preloadResource = useCallback((href: string, as: string = 'script') => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  }, [])

  // Optimize images for better performance
  const optimizeImage = useCallback((src: string, width?: number, height?: number) => {
    // Return optimized image URL (implementation depends on your CDN/service)
    // For now, just return the original src
    return src
  }, [])

  // Defer non-critical JavaScript
  const deferScript = useCallback((src: string) => {
    const script = document.createElement('script')
    script.src = src
    script.defer = true
    document.head.appendChild(script)
  }, [])

  // Initialize performance monitoring
  useEffect(() => {
    if (enableCoreWebVitals) {
      PerformanceMonitor.startCoreWebVitalsMonitoring()
    }

    // Cleanup on unmount
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      if (timeoutId.current) {
        clearTimeout(timeoutId.current)
      }
      PerformanceMonitor.stopAllMonitoring()
    }
  }, [enableCoreWebVitals])

  // Report performance metrics periodically
  useEffect(() => {
    if (!enableMetrics) return

    const interval = setInterval(() => {
      PerformanceMonitor.logSummary()
    }, 30000) // Log every 30 seconds

    return () => clearInterval(interval)
  }, [enableMetrics])

  return {
    optimizedScrollHandler,
    debounce,
    measureRender,
    preloadResource,
    optimizeImage,
    deferScript,
    getMetrics: () => PerformanceMonitor.getAllMetrics(),
    clearMetrics: () => PerformanceMonitor.clearMetrics()
  }
}