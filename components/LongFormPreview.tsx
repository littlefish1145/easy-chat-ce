'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, User } from 'lucide-react';
import { Message } from '@/types/chat';
import { MessageRenderer } from './MessageRenderer';

interface LongFormPreviewProps {
  message: Message;
  onClose: () => void;
}

export function LongFormPreview({ message, onClose }: LongFormPreviewProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate in
    const tl = gsap.timeline();
    
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    ).fromTo(
      contentRef.current,
      { x: '100%' },
      { x: 0, duration: 0.4, ease: 'power3.out' },
      '<0.1'
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(contentRef.current, {
      x: '100%',
      duration: 0.3,
      ease: 'power3.in',
    }).to(
      overlayRef.current,
      { opacity: 0, duration: 0.2 },
      '<0.1'
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/20"
        onClick={handleClose}
      />

      {/* Preview Panel */}
      <div
        ref={contentRef}
        className="relative ml-auto w-full md:w-3/4 lg:w-2/3 h-full bg-white border-l border-border shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {message.avatar ? (
              <img
                src={message.avatar}
                alt={message.username}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-text-secondary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-text-primary">{message.username}</h3>
              <p className="text-xs text-text-secondary">{formatTime(message.time)}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-hover rounded-lg transition-colors"
            title="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 py-8">
          <article className="max-w-3xl mx-auto">
            <MessageRenderer
              content={message.msg}
              type="long-form"
              metadata={message.metadata}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
