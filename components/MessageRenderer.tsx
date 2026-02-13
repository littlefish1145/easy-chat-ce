'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import DOMPurify from 'isomorphic-dompurify';
import mermaid from 'mermaid';
import { Copy, Check, FileText, Download } from 'lucide-react';
import { formatFileSize } from '@/lib/upload';
import 'katex/dist/katex.min.css';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
});

interface MessageRendererProps {
  content: string;
  type?: 'text' | 'markdown' | 'long-form' | 'image' | 'file';
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    imageUrl?: string;
    mimeType?: string;
    fileSize?: number;
  };
  onExpand?: () => void;
}

export function MessageRenderer({ content, type = 'text', metadata, onExpand }: MessageRendererProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [mermaidSvg, setMermaidSvg] = useState<string>('');

  useEffect(() => {
    if (type === 'markdown' || type === 'long-form') {
      renderMermaidDiagrams();
    }
  }, [content, type]);

  const renderMermaidDiagrams = async () => {
    const mermaidBlocks = mermaidRef.current?.querySelectorAll('.language-mermaid');
    if (mermaidBlocks) {
      mermaidBlocks.forEach(async (block, index) => {
        try {
          const code = block.textContent || '';
          const { svg } = await mermaid.render(`mermaid-${Date.now()}-${index}`, code);
          block.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid render error:', error);
        }
      });
    }
  };

  // Text message
  if (type === 'text') {
    return <p className="text-sm whitespace-pre-wrap break-words">{content}</p>;
  }

  // Image message
  if (type === 'image') {
    return (
      <div className="max-w-md">
        <img
          src={metadata?.imageUrl || content}
          alt={metadata?.fileName || 'Image'}
          className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(metadata?.imageUrl || content, '_blank')}
        />
        {metadata?.fileName && (
          <p className="text-xs text-text-secondary mt-1">{metadata.fileName}</p>
        )}
      </div>
    );
  }

  // File message
  if (type === 'file') {
    return (
      <div className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg max-w-md hover:bg-hover transition-colors">
        <div className="w-12 h-12 bg-background border border-border rounded flex items-center justify-center flex-shrink-0">
          <FileText size={24} className="text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{metadata?.fileName || '文件'}</p>
          <p className="text-xs text-text-secondary">
            {metadata?.fileSize ? formatFileSize(metadata.fileSize) : '未知大小'}
          </p>
        </div>
        {metadata?.fileUrl && (
          <a
            href={metadata.fileUrl}
            download={metadata.fileName}
            className="p-2 hover:bg-background rounded transition-colors"
            title="下载"
          >
            <Download size={18} />
          </a>
        )}
      </div>
    );
  }

  // Markdown or Long-form message with XSS protection
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
  });

  return (
    <div
      ref={mermaidRef}
      className={`prose prose-sm max-w-none ${
        type === 'long-form' ? 'prose-lg cursor-pointer hover:bg-hover/30 transition-colors p-4 rounded-lg' : ''
      }`}
      onClick={type === 'long-form' ? onExpand : undefined}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            if (language === 'mermaid') {
              return (
                <div className="mermaid-container my-4">
                  <pre className="language-mermaid">{codeString}</pre>
                </div>
              );
            }

            if (!inline && language) {
              return (
                <CodeBlock code={codeString} language={language} />
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
                {...props}
              >
                {children}
              </a>
            );
          },
          img({ src, alt, ...props }) {
            return (
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto my-2"
                loading="lazy"
                {...props}
              />
            );
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
      {type === 'long-form' && (
        <div className="text-xs text-text-secondary mt-2 flex items-center gap-1">
          <FileText size={14} />
          <span>点击查看完整内容</span>
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="p-2 bg-surface border border-border rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-hover"
          title={copied ? '已复制!' : '复制代码'}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
