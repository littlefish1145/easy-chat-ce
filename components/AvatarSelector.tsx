'use client';

import { useRef, useState } from 'react';
import { User, Upload, X } from 'lucide-react';
import { uploadImage } from '@/lib/upload';

interface AvatarSelectorProps {
  currentAvatar?: string;
  onAvatarChange: (avatar: string) => void;
  onClose?: () => void;
}

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Princess',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Simon',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Boots',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buster',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow',
];

export function AvatarSelector({ currentAvatar, onAvatarChange, onClose }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    onAvatarChange(avatar);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await uploadImage(file);
      handleSelect(result.url);
    } catch (error) {
      alert(error instanceof Error ? error.message : '上传失败');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">选择头像</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-hover rounded transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Current Avatar */}
        <div className="mb-6 text-center">
          <div className="inline-block mb-2">
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt="Current avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-border flex items-center justify-center">
                <User size={40} className="text-text-secondary" />
              </div>
            )}
          </div>
          <p className="text-sm text-text-secondary">当前头像</p>
        </div>

        {/* Default Avatars */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-3">预设头像</p>
          <div className="grid grid-cols-4 gap-3">
            {DEFAULT_AVATARS.map((avatar, index) => (
              <button
                key={index}
                onClick={() => handleSelect(avatar)}
                className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                  selectedAvatar === avatar ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom Avatar */}
        <div className="pt-4 border-t border-border">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 p-3 border border-border rounded-lg hover:bg-hover transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>上传中...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>上传自定义头像</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
