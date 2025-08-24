// Optimized loading spinner with reduced animations for better performance
import { memo } from 'react'

interface OptimizedLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

const OptimizedLoadingSpinner = memo(({ 
  size = 'lg', 
  message = 'Chargement...', 
  className = '' 
}: OptimizedLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}
          style={{ animationDuration: '1s' }}
        />
      </div>
      <p className={`text-muted-foreground ${textSizes[size]} font-medium`}>
        {message}
      </p>
    </div>
  )
})

OptimizedLoadingSpinner.displayName = 'OptimizedLoadingSpinner'

export default OptimizedLoadingSpinner