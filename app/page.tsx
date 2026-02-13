'use client';

import { useEffect, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useRooms } from '@/hooks/useRooms';
import { useUsername } from '@/hooks/useUsername';
import { Sidebar } from '@/components/Sidebar';
import { MessageList } from '@/components/MessageList';
import { MessageInput } from '@/components/MessageInput';
import { ToastContainer } from '@/components/ToastContainer';
import { MobileSidebar } from '@/components/MobileSidebar';
import { Menu } from 'lucide-react';

const DEFAULT_ROOM_ID = 26329675;

export default function ChatPage() {
  const [chatId, setChatId] = useState<number>(DEFAULT_ROOM_ID);
  const [showPromptUsername, setShowPromptUsername] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const { messages, isLoading, sendMessage } = useChat(chatId);
  const { rooms, addRoom, removeRoom } = useRooms();
  const { username, isLoaded, updateUsername } = useUsername();

  // Prompt for username on first visit
  useEffect(() => {
    if (isLoaded && !username) {
      setShowPromptUsername(true);
    }
  }, [isLoaded, username]);

  useEffect(() => {
    if (showPromptUsername) {
      const name = prompt('请输入用户名（将保存在本地）', '匿名');
      if (name?.trim()) {
        updateUsername(name);
      } else {
        updateUsername('匿名');
      }
      setShowPromptUsername(false);
    }
  }, [showPromptUsername, updateUsername]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendMessage(username, text);
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast('消息发送成功', 'success', 2000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '发送失败';
      if (typeof window !== 'undefined' && (window as any).showToast) {
        (window as any).showToast(message, 'error', 3000);
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden">
      {/* Toast Container */}
      <ToastContainer />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          rooms={rooms}
          activeRoomId={chatId}
          onRoomSelect={setChatId}
          onRoomAdd={addRoom}
          onRoomRemove={removeRoom}
          username={username}
          onUsernameChange={updateUsername}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        rooms={rooms}
        activeRoomId={chatId}
        onRoomSelect={setChatId}
        onRoomRemove={removeRoom}
        username={username}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-surface p-4 shadow-sm flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden p-2 hover:bg-background rounded-lg transition-all"
              >
                <Menu size={24} className="text-primary" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  {rooms.find((r) => r.id === chatId)?.title || '聊天室'}
                </h1>
                <p className="text-xs text-text-secondary">
                  房间ID: {chatId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <MessageList
          messages={messages}
          username={username}
          isLoading={isLoading}
        />

        {/* Input */}
        <MessageInput
          onSend={handleSendMessage}
          disabled={false}
        />
      </div>
    </div>
  );
}
