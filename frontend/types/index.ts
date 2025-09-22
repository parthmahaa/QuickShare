
export type Mode = "share" | "receive";
export type NotificationType = "success" | "error" | "info";

export interface FileData {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string | null;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ShareData {
  shareId: string;
  shareLink: string;
  shareCode: string;
}

export interface DownloadData {
  code: string;
  files: UploadedFile[];
  expiryTime: Date;
}

export interface Notification {
  message: string;
  type: NotificationType;
}