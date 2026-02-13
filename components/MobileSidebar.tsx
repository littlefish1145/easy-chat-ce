'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Menu } from 'lucide-react';
import { Room } from '@/types/chat';
import { RoomList } from './RoomList';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  activeRoomId: number;
  onRoomSelect: (roomId: number) => void;
  onRoomRemove: (roomId: number) => void;
  username: string;
}

export function MobileSidebar({
  isOpen,
  onClose,
  rooms,
  activeRoomId,
  onRoomSelect,
  onRoomRemove,
  username,
}: MobileSidebarProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current && sidebarRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
        );
        gsap.fromTo(
          sidebarRef.current,
          { x: -320 },
          { x: 0, duration: 0.3, ease: 'power2.out' },
        );
      }
    } else {
      if (overlayRef.current && sidebarRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          pointerEvents: 'none',
        });
        gsap.to(sidebarRef.current, {
          x: -320,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => !isOpen}
        className="md:hidden fixed top-4 left-4 z-40 p-2 hover:bg-background rounded-lg transition-all"
      >
        <Menu size={24} className="text-primary" />
      </button>
    );
  }

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-30 md:hidden"
        onClick={onClose}
      />
      <div
        ref={sidebarRef}
        className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border z-40 p-4 overflow-y-auto flex flex-col"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-primary">聊天室</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 pb-4 border-b border-border">
          <p className="text-xs text-text-secondary mb-1">当前用户</p>
          <p className="text-lg font-bold text-primary truncate">{username}</p>
        </div>

        <div className="flex-1">
          <RoomList
            rooms={rooms}
            activeRoomId={activeRoomId}
            onRoomSelect={(id) => {
              onRoomSelect(id);
              onClose();
            }}
            onRoomRemove={onRoomRemove}
          />
        </div>
      </div>
    </>
  );
}
