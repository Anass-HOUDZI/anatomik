import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Appeler le callback d'erreur si fourni
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-red-200 dark:border-red-800">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Icône d'erreur */}
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>

                {/* Titre */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Oops ! Une erreur s'est produite
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Quelque chose s'est mal passé lors de l'exécution de l'application.
                  </p>
                </div>

                {/* Détails de l'erreur (en mode développement) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
                    <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Détails techniques (développement)
                    </summary>
                    <div className="text-sm font-mono text-red-600 dark:text-red-400 space-y-2">
                      <div>
                        <strong>Erreur:</strong> {this.state.error.message}
                      </div>
                      {this.state.error.stack && (
                        <div>
                          <strong>Stack:</strong>
                          <pre className="whitespace-pre-wrap text-xs mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={this.handleReset}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réessayer
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    size="lg"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </div>

                {/* Message d'aide */}
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                  <p className="text-blue-800 dark:text-blue-200">
                    💡 <strong>Astuce:</strong> Si le problème persiste, essayez de vider le cache de votre navigateur 
                    ou utilisez la page de contact pour signaler ce bug.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Composant wrapper pour une utilisation plus simple
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  name?: string;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  name = 'Component' 
}) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log l'erreur avec le contexte
    console.error(`Error in ${name}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Ici vous pourriez envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, etc.
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};