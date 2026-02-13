'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@/types/chat';
import { XESCloudValue } from '@/lib/xes-cloud';

export function useChat(chatId: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pollingRef = useRef<number | null>(null);
  const xRef = useRef<XESCloudValue | null>(null);

  const startPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    xRef.current = new XESCloudValue(String(chatId));
    const x = xRef.current;
    setIsLoading(true);

    const tick = async () => {
      try {
        const all = await x.getAllNum();
        const parsed: Message[] = [];
        Object.entries(all).forEach(([name]) => {
          const parsedJson = JSON.parse(name);
          const t = Number(parsedJson.time) || 0;
          parsed.push({
            username: parsedJson.username || '',
            msg: parsedJson.msg || '',
            time: t,
          });
        });
        parsed.sort((a, b) => a.time - b.time);
        setMessages(parsed);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setIsLoading(false);
      }
    };

    tick();
    pollingRef.current = window.setInterval(tick, 1000);
  }, [chatId]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [chatId, startPolling, stopPolling]);

  const sendMessage = useCallback(
    async (username: string, msg: string) => {
      if (!msg.trim()) {
        throw new Error('不能发送空消息');
      }

      const x = xRef.current;
      if (!x) {
        throw new Error('Chat not initialized');
      }

      const t = String(Date.now() / 1000);
      const payload = JSON.stringify({ username, msg: msg.trim(), time: t });

      try {
        await x.sendNum(payload, t);
        return true;
      } catch (error) {
        throw new Error('发送失败');
      }
    },
    [],
  );

  return { messages, isLoading, sendMessage };
}
