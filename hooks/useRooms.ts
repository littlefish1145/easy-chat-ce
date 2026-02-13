'use client';

import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/types/chat';

const ROOMS_STORAGE_KEY = 'chatRooms';
const DEFAULT_ROOM_ID = 26329675;

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ROOMS_STORAGE_KEY);
    if (stored) {
      try {
        setRooms(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse rooms:', error);
        setRooms([{ id: DEFAULT_ROOM_ID, title: '项目大群' }]);
      }
    } else {
      setRooms([{ id: DEFAULT_ROOM_ID, title: '项目大群' }]);
    }
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(rooms));
    }
  }, [rooms]);

  const addRoom = useCallback((id: number, title: string) => {
    setRooms(prev => {
      if (prev.some(room => room.id === id)) {
        return prev;
      }
      return [...prev, { id, title }];
    });
  }, []);

  const removeRoom = useCallback((id: number) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  }, []);

  return { rooms, addRoom, removeRoom };
}
