'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  index: number;
}

export function MessageBubble({ message, isOwn, index }: MessageBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: index * 0.05,
          ease: 'power2.out',
        },
      );
    }
  }, [index]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div
      ref={ref}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 px-2`}
    >
      <div
        className={`flex flex-col max-w-xs sm:max-w-sm lg:max-w-md ${
          isOwn ? 'items-end' : 'items-start'
        }`}
      >
        <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <div
            className={`rounded-2xl px-4 py-2 shadow-sm ${
              isOwn
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-surface border border-border text-text-primary rounded-bl-none'
            }`}
          >
            <p className="text-sm break-words whitespace-pre-wrap">{message.msg}</p>
          </div>
          <div
            className={`flex flex-col items-center gap-1 min-w-12 ${
              isOwn ? 'items-end' : 'items-start'
            }`}
          >
            <span className="text-xs text-text-secondary truncate">
              {message.username}
            </span>
            <span className="text-xs text-text-secondary">
              {formatTime(message.time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
