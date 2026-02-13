'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Room } from '@/types/chat';
import { X } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  activeRoomId: number;
  onRoomSelect: (roomId: number) => void;
  onRoomRemove: (roomId: number) => void;
}

export function RoomList({
  rooms,
  activeRoomId,
  onRoomSelect,
  onRoomRemove,
}: RoomListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.room-item'),
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        },
      );
    }
  }, [rooms]);

  return (
    <div ref={containerRef} className="space-y-2">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="room-item"
        >
          <button
            onClick={() => onRoomSelect(room.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
              activeRoomId === room.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-surface hover:bg-background text-text-primary border border-border'
            }`}
          >
            <div className="font-medium truncate">{room.title}</div>
            <div className="text-xs opacity-70 mt-1">ID: {room.id}</div>
          </button>
          {room.id !== 26329675 && (
            <button
              onClick={() => onRoomRemove(room.id)}
              className="text-xs text-text-secondary hover:text-error mt-2 flex items-center gap-1"
            >
              <X size={14} /> 移除
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
