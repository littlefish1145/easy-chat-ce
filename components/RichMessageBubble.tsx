'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Message } from '@/types/chat';
import { MessageRenderer } from './MessageRenderer';
import { User } from 'lucide-react';

interface RichMessageBubbleProps {
  message: Message;
  isOwn: boolean;
  index: number;
  onExpandLongForm?: (message: Message) => void;
}

export function RichMessageBubble({ message, isOwn, index, onExpandLongForm }: RichMessageBubbleProps) {
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
          delay: Math.min(index * 0.03, 0.5),
          ease: 'power2.out',
        }
      );
    }
  }, [index]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getAvatar = () => {
    if (message.avatar) {
      return (
        <img
          src={message.avatar}
          alt={message.username}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
        <User size={16} className="text-text-secondary" />
      </div>
    );
  };

  return (
    <div
      ref={ref}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 px-2`}
    >
      <div
        className={`flex gap-3 max-w-2xl ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">{getAvatar()}</div>

        {/* Message Content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
          {/* Username and Time */}
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-xs font-medium text-text-primary">{message.username}</span>
            <span className="text-xs text-text-secondary">{formatTime(message.time)}</span>
          </div>

          {/* Message Bubble */}
          <div
            className={`rounded-2xl px-4 py-2 shadow-sm ${
              isOwn
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-surface border border-border text-text-primary rounded-bl-none'
            }`}
          >
            <MessageRenderer
              content={message.msg}
              type={message.type}
              metadata={message.metadata}
              onExpand={
                message.type === 'long-form' && onExpandLongForm
                  ? () => onExpandLongForm(message)
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
