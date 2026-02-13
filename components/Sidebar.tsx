'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Plus, LogOut } from 'lucide-react';
import { Room } from '@/types/chat';
import { RoomList } from './RoomList';
import { CreateRoomDialog, JoinRoomDialog } from './RoomDialogs';

interface SidebarProps {
  rooms: Room[];
  activeRoomId: number;
  onRoomSelect: (roomId: number) => void;
  onRoomAdd: (id: number, title: string) => void;
  onRoomRemove: (roomId: number) => void;
  username: string;
  onUsernameChange: (username: string) => void;
}

export function Sidebar({
  rooms,
  activeRoomId,
  onRoomSelect,
  onRoomAdd,
  onRoomRemove,
  username,
  onUsernameChange,
}: SidebarProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      );
    }
  }, []);

  const handleChangeUsername = () => {
    const newUsername = prompt('输入新的用户名：', username);
    if (newUsername?.trim()) {
      onUsernameChange(newUsername);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full md:w-80 bg-background border-b md:border-b-0 md:border-r border-border flex flex-col p-4 max-h-96 md:max-h-screen overflow-y-auto"
      >
        {/* User Info */}
        <div className="mb-6 pb-4 border-b border-border">
          <div className="mb-3">
            <p className="text-xs text-text-secondary mb-1">当前用户</p>
            <p className="text-lg font-bold text-primary truncate">{username}</p>
          </div>
          <button
            onClick={handleChangeUsername}
            className="w-full px-3 py-2 text-sm bg-primary hover:bg-primary-dark text-white rounded-lg transition-all active:scale-95"
          >
            切换用户名
          </button>
        </div>

        {/* Room Selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-text-primary mb-3">
            选择聊天室
          </p>
          <RoomList
            rooms={rooms}
            activeRoomId={activeRoomId}
            onRoomSelect={onRoomSelect}
            onRoomRemove={onRoomRemove}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-border flex gap-2">
          <button
            onClick={() => setShowCreateDialog(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">创建</span>
          </button>
          <button
            onClick={() => setShowJoinDialog(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-all active:scale-95"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">加入</span>
          </button>
        </div>
      </div>

      <CreateRoomDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onRoomCreated={onRoomAdd}
        username={username}
      />

      <JoinRoomDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        onRoomJoined={onRoomAdd}
        existingRoomIds={rooms.map((r) => r.id)}
      />
    </>
  );
}
