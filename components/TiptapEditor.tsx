'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  X,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  onSubmit?: (html: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content = '',
  onChange,
  onSubmit,
  onCancel,
  placeholder = '开始写作...',
  className = '',
}: TiptapEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-surface border border-border rounded-lg p-4 font-mono text-sm',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[300px] px-12 py-8',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, []);

  const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const addLink = () => {
      const url = window.prompt('输入链接URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    const addImage = () => {
      const url = window.prompt('输入图片URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };

    return (
      <div className="border-b border-border bg-surface px-4 py-2 flex flex-wrap gap-1 sticky top-0 z-10">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('bold') ? 'bg-primary text-white' : ''
          }`}
          title="粗体"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('italic') ? 'bg-primary text-white' : ''
          }`}
          title="斜体"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('strike') ? 'bg-primary text-white' : ''
          }`}
          title="删除线"
        >
          <Strikethrough size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('code') ? 'bg-primary text-white' : ''
          }`}
          title="行内代码"
        >
          <Code size={18} />
        </button>

        <div className="w-px bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-primary text-white' : ''
          }`}
          title="标题1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : ''
          }`}
          title="标题2"
        >
          <Heading2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : ''
          }`}
          title="标题3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary text-white' : ''
          }`}
          title="无序列表"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary text-white' : ''
          }`}
          title="有序列表"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('blockquote') ? 'bg-primary text-white' : ''
          }`}
          title="引用"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('codeBlock') ? 'bg-primary text-white' : ''
          }`}
          title="代码块"
        >
          <Code size={18} />
        </button>

        <div className="w-px bg-border mx-1" />

        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-hover transition-colors ${
            editor.isActive('link') ? 'bg-primary text-white' : ''
          }`}
          title="链接"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-hover transition-colors"
          title="图片"
        >
          <ImageIcon size={18} />
        </button>

        <div className="w-px bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-hover transition-colors disabled:opacity-30"
          title="撤销"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-hover transition-colors disabled:opacity-30"
          title="重做"
        >
          <Redo size={18} />
        </button>

        <div className="flex-1" />

        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 rounded hover:bg-hover transition-colors text-text-secondary"
            title="取消"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  };

  const handleSubmit = () => {
    if (editor && onSubmit) {
      const html = editor.getHTML();
      if (html && html !== '<p></p>') {
        onSubmit(html);
        editor.commands.clearContent();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`border border-border rounded-lg bg-white shadow-lg overflow-hidden ${className}`}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="bg-white" />
      {onSubmit && (
        <div className="border-t border-border bg-surface px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded hover:bg-hover transition-colors text-sm"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-light transition-colors text-sm"
          >
            发送长文
          </button>
        </div>
      )}
    </div>
  );
}
