/**
 * @file useAsync.js
 * @description Custom hook for robust Async State and Loading/Error Handling in React.
 * Implements standard lifecycle model: idle | loading | success | error for academic evaluation.
 */

import { useState, useCallback } from 'react';

export const useAsync = (asyncFunction, immediate = false) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus('loading');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus('success');
        return response;
      } catch (err) {
        setError(err?.message || 'An unexpected error occurred');
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
};
