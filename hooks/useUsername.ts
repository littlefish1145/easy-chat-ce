'use client';

import { useState, useEffect, useCallback } from 'react';

const USERNAME_STORAGE_KEY = 'chatUsername';

export function useUsername() {
  const [username, setUsername] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USERNAME_STORAGE_KEY);
    if (stored) {
      setUsername(stored);
    }
    setIsLoaded(true);
  }, []);

  const updateUsername = useCallback((newUsername: string) => {
    localStorage.setItem(USERNAME_STORAGE_KEY, newUsername);
    setUsername(newUsername);
  }, []);

  return { username, isLoaded, updateUsername };
}
