// Performance monitoring utility for optimization tracking
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();
  private static observers = new Map<string, PerformanceObserver>();

  // Start measuring performance for a specific operation
  static startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  // End measuring and record the result
  static endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const entries = performance.getEntriesByName(name);
    const duration = entries[entries.length - 1]?.duration || 0;
    
    // Store metric
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    // Clean up marks
    performance.clearMarks(`${name}-start`);
    performance.clearMarks(`${name}-end`);
    performance.clearMeasures(name);
    
    return duration;
  }

  // Get average performance for an operation
  static getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Get all performance metrics
  static getAllMetrics(): Record<string, { average: number; count: number; total: number }> {
    const result: Record<string, { average: number; count: number; total: number }> = {};
    
    this.metrics.forEach((times, name) => {
      const total = times.reduce((sum, time) => sum + time, 0);
      result[name] = {
        average: total / times.length,
        count: times.length,
        total
      };
    });
    
    return result;
  }

  // Monitor LCP (Largest Contentful Paint)
  static monitorLCP(callback?: (value: number) => void): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      const lcp = lastEntry?.startTime || 0;
      
      if (callback) callback(lcp);
      console.log('LCP:', lcp);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('lcp', observer);
  }

  // Monitor CLS (Cumulative Layout Shift)
  static monitorCLS(callback?: (value: number) => void): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if (callback) callback(clsValue);
      console.log('CLS:', clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('cls', observer);
  }

  // Monitor FID (First Input Delay)
  static monitorFID(callback?: (value: number) => void): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        if (callback) callback(fid);
        console.log('FID:', fid);
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('fid', observer);
  }

  // Start monitoring all core web vitals
  static startCoreWebVitalsMonitoring(): void {
    this.monitorLCP();
    this.monitorCLS();  
    this.monitorFID();
  }

  // Stop all monitoring
  static stopAllMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  // Clear all metrics
  static clearMetrics(): void {
    this.metrics.clear();
  }

  // Log performance summary
  static logSummary(): void {
    const metrics = this.getAllMetrics();
    console.group('Performance Summary');
    Object.entries(metrics).forEach(([name, data]) => {
      console.log(`${name}: ${data.average.toFixed(2)}ms avg (${data.count} calls)`);
    });
    console.groupEnd();
  }
}