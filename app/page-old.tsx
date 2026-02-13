'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useChat } from '@/hooks/useChat';
import { useRooms } from '@/hooks/useRooms';
import { useUsername } from '@/hooks/useUsername';
import { Sidebar } from '@/components/Sidebar';
import { RichMessageBubble } from '@/components/RichMessageBubble';
import { RichMessageInput } from '@/components/RichMessageInput';
import { ToastContainer } from '@/components/ToastContainer';
import { MobileSidebar } from '@/components/MobileSidebar';
import { LongFormPreview } from '@/components/LongFormPreview';
import { AvatarSelector } from '@/components/AvatarSelector';
import { Menu, Settings } from 'lucide-react';
import { Message } from '@/types/chat';

const DEFAULT_ROOM_ID = 26329675;

export default function ChatPage() {
  const [chatId, setChatId] = useState<number>(DEFAULT_ROOM_ID);
  const [showPromptUsername, setShowPromptUsername] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<Message | null>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  const { messages, isLoading, sendMessage } = useChat(chatId);
  const { rooms, addRoom, removeRoom } = useRooms();
  const { username, avatar, isLoaded, updateUsername, updateAvatar } = useUsername();

  const messageListRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);

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

  // Smart auto-scroll behavior
  useEffect(() => {
    const messageList = messageListRef.current;
    if (!messageList) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messageList;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserHasScrolled(!isNearBottom);
    };

    messageList.addEventListener('scroll', handleScroll);
    return () => messageList.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom only when new messages arrive and user hasn't scrolled up
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current && !userHasScrolled) {
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, userHasScrolled]);

  // Smooth room switching animation
  const handleRoomChange = (newRoomId: number) => {
    if (newRoomId === chatId) return;

    const tl = gsap.timeline();
    tl.to(mainContentRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setChatId(newRoomId);
        setUserHasScrolled(false);
      },
    }).to(mainContentRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleSendText = async (text: string) => {
    try {
      await sendMessage(username, text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSendImage = async (imageUrl: string, fileName: string) => {
    const msgText = `[图片] ${fileName}`;
    // In a real implementation, you'd send structured data
    await handleSendText(msgText);
  };

  const handleSendFile = async (
    fileUrl: string,
    fileName: string,
    fileSize: number,
    mimeType: string
  ) => {
    const msgText = `[文件] ${fileName}`;
    // In a real implementation, you'd send structured data
    await handleSendText(msgText);
  };

  const handleSendLongForm = async (html: string) => {
    const msgText = `[长文]\n${html}`;
    // In a real implementation, you'd send structured data with type='long-form'
    await handleSendText(msgText);
  };

  const handleExpandLongForm = (message: Message) => {
    setPreviewMessage(message);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-text-secondary">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      {/* Toast Container */}
      <ToastContainer />

      {/* Avatar Selector */}
      {showAvatarSelector && (
        <AvatarSelector
          currentAvatar={avatar}
          onAvatarChange={(newAvatar) => {
            updateAvatar(newAvatar);
            setShowAvatarSelector(false);
          }}
          onClose={() => setShowAvatarSelector(false)}
        />
      )}

      {/* Long-form Preview */}
      {previewMessage && (
        <LongFormPreview message={previewMessage} onClose={() => setPreviewMessage(null)} />
      )}

      {/* Desktop Sidebar - Hidden in preview mode */}
      {!previewMessage && (
        <div className="hidden md:flex">
          <Sidebar
            rooms={rooms}
            activeRoomId={chatId}
            onRoomSelect={handleRoomChange}
            onRoomAdd={addRoom}
            onRoomRemove={removeRoom}
            username={username}
            onUsernameChange={updateUsername}
            avatar={avatar}
            onAvatarClick={() => setShowAvatarSelector(true)}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      {!previewMessage && (
        <MobileSidebar
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
          rooms={rooms}
          activeRoomId={chatId}
          onRoomSelect={(id) => {
            handleRoomChange(id);
            setShowMobileSidebar(false);
          }}
          onRoomRemove={removeRoom}
          username={username}
          avatar={avatar}
        />
      )}

      {/* Main Chat Area */}
      <div
        ref={mainContentRef}
        className={`flex-1 flex flex-col transition-all duration-300 ${
          previewMessage ? 'md:mr-0' : ''
        }`}
      >
        {/* Header */}
        {!previewMessage && (
          <div className="border-b border-border bg-surface p-4 shadow-sm flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileSidebar(true)}
                  className="md:hidden p-2 hover:bg-hover rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-xl font-bold">
                    {rooms.find((r) => r.id === chatId)?.title || '聊天室'}
                  </h1>
                  <p className="text-xs text-text-secondary">房间ID: {chatId}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAvatarSelector(true)}
              className="p-2 hover:bg-hover rounded-lg transition-colors"
              title="设置"
            >
              <Settings size={20} />
            </button>
          </div>
        )}

        {/* Messages */}
        <div ref={messageListRef} className="flex-1 overflow-y-auto">
          <div className="p-2 sm:p-4 flex flex-col">
            {messages.map((message, index) => (
              <RichMessageBubble
                key={`${message.username}-${message.time}-${index}`}
                message={{
                  ...message,
                  avatar: message.username === username ? avatar : undefined,
                }}
                isOwn={message.username === username}
                index={index}
                onExpandLongForm={handleExpandLongForm}
              />
            ))}
            {isLoading && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        {!previewMessage && (
          <RichMessageInput
            onSendText={handleSendText}
            onSendImage={handleSendImage}
            onSendFile={handleSendFile}
            onSendLongForm={handleSendLongForm}
            disabled={false}
          />
        )}
      </div>
    </div>
  );
}
