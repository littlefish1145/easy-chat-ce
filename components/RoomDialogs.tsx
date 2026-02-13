'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { XESCloudValue } from '@/lib/xes-cloud';

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (id: number, title: string) => void;
  username: string;
}

export function CreateRoomDialog({
  isOpen,
  onClose,
  onRoomCreated,
  username,
}: CreateRoomDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current && dialogRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
        );
        gsap.fromTo(
          dialogRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out' },
        );
      }
    }
  }, [isOpen]);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const projectId = String(Math.floor(Math.random() * 1000000000));
      const x = new XESCloudValue(projectId);
      const time = String(Date.now() / 1000);
      const data = { username, msg: 'Init.', time };
      await x.sendNum(JSON.stringify(data), time);

      onRoomCreated(Number(projectId), `房间${projectId}`);
      await navigator.clipboard.writeText(projectId);
      onClose();
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-surface rounded-xl p-6 shadow-xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary">创建新聊天室</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-text-secondary text-sm mb-6">
          即将为您创建一个新的聊天室，房间ID将自动复制到剪贴板。
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background transition-all"
          >
            取消
          </button>
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? '创建中...' : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface JoinRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomJoined: (id: number, title: string) => void;
  existingRoomIds: number[];
}

export function JoinRoomDialog({
  isOpen,
  onClose,
  onRoomJoined,
  existingRoomIds,
}: JoinRoomDialogProps) {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (overlayRef.current && dialogRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
        );
        gsap.fromTo(
          dialogRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out' },
        );
      }
    }
  }, [isOpen]);

  const handleJoinRoom = () => {
    const id = parseInt(roomId);
    if (!roomId.trim()) {
      setError('请输入房间ID');
      return;
    }
    if (isNaN(id)) {
      setError('房间ID必须是数字');
      return;
    }
    if (existingRoomIds.includes(id)) {
      setError('您已经加入过这个房间了');
      return;
    }

    onRoomJoined(id, `房间${roomId}`);
    setRoomId('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="bg-surface rounded-xl p-6 shadow-xl max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-primary">加入聊天室</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-2">
            房间ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
              setError('');
            }}
            placeholder="输入您要加入的房间ID"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background text-text-primary"
          />
          {error && <p className="text-error text-sm mt-2">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary hover:bg-background transition-all"
          >
            取消
          </button>
          <button
            onClick={handleJoinRoom}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all"
          >
            加入
          </button>
        </div>
      </div>
    </div>
  );
}
