'use client';

import { useState, useEffect, useCallback } from 'react';

const USERNAME_STORAGE_KEY = 'chatUsername';
const AVATAR_STORAGE_KEY = 'chatAvatar';

export function useUsername() {
  const [username, setUsername] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem(USERNAME_STORAGE_KEY);
    const storedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (storedName) {
      setUsername(storedName);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
    setIsLoaded(true);
  }, []);

  const updateUsername = useCallback((newUsername: string) => {
    localStorage.setItem(USERNAME_STORAGE_KEY, newUsername);
    setUsername(newUsername);
  }, []);

  const updateAvatar = useCallback((newAvatar: string) => {
    localStorage.setItem(AVATAR_STORAGE_KEY, newAvatar);
    setAvatar(newAvatar);
  }, []);

  return { username, avatar, isLoaded, updateUsername, updateAvatar };
}
