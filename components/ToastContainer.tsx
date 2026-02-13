'use client';

import { useState, useCallback, useRef } from 'react';
import { Toast, ToastType } from './Toast';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = String(++idRef.current);
    setToasts((prev) => [...prev, { id, type, message }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose methods via window for global access
  if (typeof window !== 'undefined') {
    (window as any).showToast = addToast;
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
}
