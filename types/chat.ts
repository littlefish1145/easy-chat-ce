export type MessageType = 'text' | 'markdown' | 'long-form' | 'image' | 'file';

export type Message = {
  username: string;
  msg: string;
  time: number;
  type?: MessageType;
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    imageUrl?: string;
    mimeType?: string;
    fileSize?: number;
  };
  avatar?: string;
};

export type Room = {
  id: number;
  title: string;
};

export type User = {
  username: string;
  avatar?: string;
};
