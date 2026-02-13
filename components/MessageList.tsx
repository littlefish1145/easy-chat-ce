'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  username: string;
  isLoading: boolean;
}

export function MessageList({ messages, username, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary">加载消息中...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-text-secondary mb-2">暂无消息</p>
          <p className="text-xs text-text-secondary">开始聊天吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="flex-1 p-2 sm:p-4 flex flex-col">
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.username}-${message.time}`}
            message={message}
            isOwn={message.username === username}
            index={index}
          />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
