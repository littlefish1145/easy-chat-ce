'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      );
    }

    const timer = setTimeout(() => {
      if (ref.current) {
        gsap.to(ref.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => onClose(id),
        });
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
        return <Info size={20} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success';
      case 'error':
        return 'bg-error/10 border-error/20 text-error';
      case 'info':
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getStyles()} shadow-lg backdrop-blur-sm`}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          if (ref.current) {
            gsap.to(ref.current, {
              opacity: 0,
              duration: 0.2,
              onComplete: () => onClose(id),
            });
          }
        }}
        className="text-current opacity-70 hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}
