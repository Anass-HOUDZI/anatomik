// Utility for lazy loading components with optimized performance
import { lazy, ComponentType } from 'react'

export class LazyLoader {
  private static loadedComponents = new Map<string, ComponentType<any>>()
  private static loadingPromises = new Map<string, Promise<ComponentType<any>>>()

  // Lazy load a component with caching
  static loadComponent(componentName: string, importFn: () => Promise<{ default: ComponentType<any> }>): ComponentType<any> {
    // Return cached component if already loaded
    if (this.loadedComponents.has(componentName)) {
      return this.loadedComponents.get(componentName)!
    }

    // Return cached promise if already loading
    if (this.loadingPromises.has(componentName)) {
      return lazy(() => this.loadingPromises.get(componentName)!.then(comp => ({ default: comp })))
    }

    // Create new loading promise
    const loadingPromise = importFn().then(module => {
      const component = module.default
      this.loadedComponents.set(componentName, component)
      this.loadingPromises.delete(componentName)
      return component
    })

    this.loadingPromises.set(componentName, loadingPromise)

    return lazy(() => loadingPromise.then(comp => ({ default: comp })))
  }

  // Preload a component without rendering
  static preloadComponent(componentName: string, importFn: () => Promise<{ default: ComponentType<any> }>): Promise<void> {
    if (this.loadedComponents.has(componentName)) {
      return Promise.resolve()
    }

    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName)!.then(() => {})
    }

    const loadingPromise = importFn().then(module => {
      const component = module.default
      this.loadedComponents.set(componentName, component)
      this.loadingPromises.delete(componentName)
      return component
    })

    this.loadingPromises.set(componentName, loadingPromise)
    return loadingPromise.then(() => {})
  }

  // Batch preload multiple components
  static preloadComponents(components: Array<{ name: string; importFn: () => Promise<{ default: ComponentType<any> }> }>): Promise<void[]> {
    return Promise.all(components.map(({ name, importFn }) => this.preloadComponent(name, importFn)))
  }

  // Get cache stats for debugging
  static getCacheStats() {
    return {
      loaded: this.loadedComponents.size,
      loading: this.loadingPromises.size,
      totalRequested: this.loadedComponents.size + this.loadingPromises.size
    }
  }

  // Clear cache if needed
  static clearCache() {
    this.loadedComponents.clear()
    this.loadingPromises.clear()
  }
}