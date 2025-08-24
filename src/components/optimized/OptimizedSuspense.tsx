// Optimized Suspense wrapper with better error boundaries
import { Suspense, memo, ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import OptimizedLoadingSpinner from './OptimizedLoadingSpinner'

interface OptimizedSuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  onError?: (error: Error) => void
}

const DefaultErrorFallback = memo(({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="text-red-500 text-4xl">⚠️</div>
    <h2 className="text-xl font-semibold text-destructive">Erreur de chargement</h2>
    <p className="text-muted-foreground text-sm text-center max-w-md">
      Une erreur s'est produite lors du chargement de ce composant.
    </p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Réessayer
    </button>
  </div>
))

DefaultErrorFallback.displayName = 'DefaultErrorFallback'

const OptimizedSuspense = memo(({ 
  children, 
  fallback, 
  errorFallback,
  onError 
}: OptimizedSuspenseProps) => {
  const defaultFallback = fallback || <OptimizedLoadingSpinner />
  
  return (
    <ErrorBoundary
      FallbackComponent={errorFallback ? () => <>{errorFallback}</> : DefaultErrorFallback}
      onError={onError}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
})

OptimizedSuspense.displayName = 'OptimizedSuspense'

export default OptimizedSuspense