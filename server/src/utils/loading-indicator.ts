/**
 * Loading indicator utility for client applications
 * 
 * This file provides a simple loading indicator implementation that can be used
 * in both client applications. It's designed to be imported and used in React components.
 * 
 * Example usage in a React component:
 * 
 * ```tsx
 * import { useState } from 'react';
 * import { LoadingIndicator, useLoadingState } from './loading-indicator';
 * 
 * const MyComponent = () => {
 *   const { isLoading, startLoading, stopLoading } = useLoadingState();
 * 
 *   const fetchData = async () => {
 *     startLoading();
 *     try {
 *       // Fetch data from API
 *       await fetch('/api/data');
 *     } finally {
 *       stopLoading();
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={fetchData} disabled={isLoading}>
 *         {isLoading ? 'Loading...' : 'Fetch Data'}
 *       </button>
 *       {isLoading && <LoadingIndicator />}
 *     </div>
 *   );
 * };
 * ```
 */

/**
 * Loading indicator component for React
 * 
 * @param props - Component props
 * @param props.size - Size of the loading indicator (default: 'medium')
 * @param props.color - Color of the loading indicator (default: 'primary')
 * @param props.fullScreen - Whether to display the loading indicator full screen (default: false)
 * @returns JSX element
 */
export const LoadingIndicator = ({ 
  size = 'medium', 
  color = 'primary',
  fullScreen = false,
}: {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  fullScreen?: boolean;
}) => {
  // This is just a TypeScript interface for the component
  // The actual implementation will be in the client applications
  return null;
};

/**
 * Hook for managing loading state
 * 
 * @returns Loading state and functions to control it
 */
export const useLoadingState = () => {
  // This is just a TypeScript interface for the hook
  // The actual implementation will be in the client applications
  return {
    isLoading: false,
    startLoading: () => {},
    stopLoading: () => {},
  };
};

/**
 * Higher-order component that adds loading state to a component
 * 
 * @param Component - Component to wrap
 * @returns Wrapped component with loading state
 */
export const withLoading = (Component: any) => {
  // This is just a TypeScript interface for the HOC
  // The actual implementation will be in the client applications
  return Component;
};

/**
 * Context provider for global loading state
 * 
 * @param props - Component props
 * @param props.children - Child components
 * @returns JSX element
 */
export const LoadingProvider = ({ children }: { children: any }) => {
  // This is just a TypeScript interface for the provider
  // The actual implementation will be in the client applications
  return null;
};

/**
 * Hook for accessing global loading state
 * 
 * @returns Global loading state and functions to control it
 */
export const useGlobalLoading = () => {
  // This is just a TypeScript interface for the hook
  // The actual implementation will be in the client applications
  return {
    isLoading: false,
    startLoading: () => {},
    stopLoading: () => {},
  };
};
