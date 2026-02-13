'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => Promise<void>;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      );
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || disabled) {
      return;
    }

    setIsLoading(true);
    try {
      await onSend(input);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        borderColor: 'var(--color-primary)',
        boxShadow: '0 0 0 3px rgba(124, 92, 219, 0.1)',
        duration: 0.3,
      });
    }
  };

  const handleBlur = () => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        borderColor: 'var(--color-border)',
        boxShadow: 'none',
        duration: 0.3,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="border-t border-border bg-surface p-2 sm:p-4 shadow-lg"
    >
      <div className="flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled || isLoading}
          placeholder="输入消息..."
          className="flex-1 border border-border rounded-lg px-3 sm:px-4 py-2 resize-none focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-background text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={disabled || isLoading || !input.trim()}
          className="bg-primary hover:bg-primary-dark text-white p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 flex-shrink-0"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
}
