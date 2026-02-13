'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Send, Image as ImageIcon, Paperclip, FileText, X } from 'lucide-react';
import { uploadImage, uploadFile, formatFileSize } from '@/lib/upload';
import { TiptapEditor } from './TiptapEditor';

interface RichMessageInputProps {
  onSendText: (message: string) => Promise<void>;
  onSendImage: (imageUrl: string, fileName: string) => Promise<void>;
  onSendFile: (fileUrl: string, fileName: string, fileSize: number, mimeType: string) => Promise<void>;
  onSendLongForm: (html: string) => Promise<void>;
  disabled: boolean;
}

export function RichMessageInput({
  onSendText,
  onSendImage,
  onSendFile,
  onSendLongForm,
  disabled,
}: RichMessageInputProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLongForm, setShowLongForm] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<{
    type: 'image' | 'file';
    url: string;
    fileName: string;
    fileSize?: number;
  } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSend = async () => {
    if (uploadPreview) {
      setIsLoading(true);
      try {
        if (uploadPreview.type === 'image') {
          await onSendImage(uploadPreview.url, uploadPreview.fileName);
        } else {
          await onSendFile(
            uploadPreview.url,
            uploadPreview.fileName,
            uploadPreview.fileSize || 0,
            'application/octet-stream'
          );
        }
        setUploadPreview(null);
      } catch (error) {
        console.error('Failed to send:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!input.trim() || isLoading || disabled) {
      return;
    }

    setIsLoading(true);
    try {
      await onSendText(input);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await uploadImage(file);
      setUploadPreview({
        type: 'image',
        url: result.url,
        fileName: result.fileName,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : '上传失败');
    } finally {
      setIsLoading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await uploadFile(file);
      setUploadPreview({
        type: 'file',
        url: result.url,
        fileName: result.fileName,
        fileSize: result.fileSize,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : '上传失败');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearUpload = () => {
    setUploadPreview(null);
  };

  const handleLongFormSubmit = async (html: string) => {
    setIsLoading(true);
    try {
      await onSendLongForm(html);
      setShowLongForm(false);
    } catch (error) {
      console.error('Failed to send long-form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showLongForm) {
    return (
      <div className="border-t border-border bg-surface p-4">
        <TiptapEditor
          onSubmit={handleLongFormSubmit}
          onCancel={() => setShowLongForm(false)}
          placeholder="开始撰写长文..."
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="border-t border-border bg-surface p-2 sm:p-4 shadow-lg">
      {uploadPreview && (
        <div className="mb-2 p-3 bg-background border border-border rounded-lg flex items-center gap-3">
          {uploadPreview.type === 'image' ? (
            <>
              <img
                src={uploadPreview.url}
                alt={uploadPreview.fileName}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadPreview.fileName}</p>
                <p className="text-xs text-text-secondary">图片</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-surface border border-border rounded flex items-center justify-center">
                <Paperclip size={24} className="text-text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadPreview.fileName}</p>
                <p className="text-xs text-text-secondary">
                  {uploadPreview.fileSize ? formatFileSize(uploadPreview.fileSize) : '文件'}
                </p>
              </div>
            </>
          )}
          <button
            onClick={clearUpload}
            className="p-1 hover:bg-hover rounded transition-colors"
            title="移除"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex gap-2 items-end">
        <div className="flex gap-1">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled || isLoading || !!uploadPreview}
            className="p-2 rounded hover:bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="上传图片"
          >
            <ImageIcon size={20} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading || !!uploadPreview}
            className="p-2 rounded hover:bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="上传文件"
          >
            <Paperclip size={20} />
          </button>

          <button
            onClick={() => setShowLongForm(true)}
            disabled={disabled || isLoading || !!uploadPreview}
            className="p-2 rounded hover:bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="撰写长文"
          >
            <FileText size={20} />
          </button>
        </div>

        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading || !!uploadPreview}
          placeholder={uploadPreview ? '添加说明...' : '输入消息...'}
          className="flex-1 border border-border rounded-lg px-3 sm:px-4 py-2 resize-none focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-background text-text-primary placeholder:text-text-secondary text-sm sm:text-base"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={disabled || isLoading || (!input.trim() && !uploadPreview)}
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
