import { useCallback } from 'react';
import { useToast } from './use-toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  logError?: boolean;
  fallbackMessage?: string;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    context?: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastTitle = 'Erreur',
      logError = true,
      fallbackMessage = 'Une erreur inattendue s\'est produite'
    } = options;

    // Déterminer le message d'erreur
    let errorMessage = fallbackMessage;
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message || fallbackMessage;
      errorDetails = error.stack || '';
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = (error as any).message || JSON.stringify(error);
    }

    // Logger l'erreur si demandé
    if (logError) {
      console.error(`[${context || 'ErrorHandler'}]`, {
        message: errorMessage,
        error,
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }

    // Afficher le toast si demandé
    if (showToast) {
      toast({
        variant: 'destructive',
        title: toastTitle,
        description: errorMessage,
        duration: 5000,
      });
    }

    return {
      message: errorMessage,
      details: errorDetails
    };
  }, [toast]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context, options);
      return null;
    }
  }, [handleError]);

  const createErrorHandler = useCallback((
    context: string,
    options: ErrorHandlerOptions = {}
  ) => {
    return (error: unknown) => handleError(error, context, options);
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    createErrorHandler
  };
};

// Hook spécialisé pour les erreurs d'API
export const useAPIErrorHandler = () => {
  const { handleError, handleAsyncError } = useErrorHandler();

  const handleAPIError = useCallback((
    error: unknown,
    endpoint?: string,
    options: Omit<ErrorHandlerOptions, 'toastTitle'> = {}
  ) => {
    return handleError(error, `API: ${endpoint || 'Unknown'}`, {
      ...options,
      toastTitle: 'Erreur de connexion'
    });
  }, [handleError]);

  const handleAsyncAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint?: string,
    options: Omit<ErrorHandlerOptions, 'toastTitle'> = {}
  ): Promise<T | null> => {
    return handleAsyncError(apiCall, `API: ${endpoint || 'Unknown'}`, {
      ...options,
      toastTitle: 'Erreur de connexion'
    });
  }, [handleAsyncError]);

  return {
    handleAPIError,
    handleAsyncAPICall
  };
};

// Hook pour les erreurs de validation
export const useValidationErrorHandler = () => {
  const { handleError } = useErrorHandler();

  const handleValidationError = useCallback((
    error: unknown,
    field?: string,
    options: Omit<ErrorHandlerOptions, 'toastTitle'> = {}
  ) => {
    return handleError(error, `Validation: ${field || 'Unknown'}`, {
      ...options,
      toastTitle: 'Erreur de validation'
    });
  }, [handleError]);

  return { handleValidationError };
};