import { useState, useEffect } from 'react';

function usePersistedState<T>(key: string, initialState: T): [T, (state: T) => void] {
  const [state, setState] = useState(() => {
    const storageValue = localStorage.getItem(key);
    return storageValue ? JSON.parse(storageValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default usePersistedState;
