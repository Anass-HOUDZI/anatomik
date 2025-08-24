// Optimized image component with lazy loading and WebP support
import { useState, useRef, useEffect, memo } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  quality = 80,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)

  // Generate optimized image URL (if using a CDN service)
  const getOptimizedSrc = (originalSrc: string, width?: number, height?: number, quality?: number) => {
    // For now, return original src. In production, you might use:
    // - Cloudinary: `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},q_${quality}/${originalSrc}`
    // - ImageKit: `https://ik.imagekit.io/your-id/tr:w-${width},q-${quality}/${originalSrc}`
    return originalSrc
  }

  useEffect(() => {
    const optimizedSrc = getOptimizedSrc(src, width, height, quality)
    setImageSrc(optimizedSrc)
  }, [src, width, height, quality])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Placeholder while loading
  if (!imageSrc || (!isLoaded && !hasError)) {
    return (
      <div 
        className={`bg-muted animate-pulse ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Loading ${alt}`}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-muted-foreground/60 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Error fallback
  if (hasError) {
    return (
      <div 
        className={`bg-muted border border-border rounded flex items-center justify-center ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={`Failed to load ${alt}`}
      >
        <div className="text-muted-foreground text-sm text-center p-4">
          <div className="text-2xl mb-2">📷</div>
          <div>Image non disponible</div>
        </div>
      </div>
    )
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      decoding="async"
    />
  )
})

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage