export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  expiresAt?: Date;
  shareCode: string;
  shareLink: string;
  downloadCount: number;
  isExpired: boolean;
  previewUrl?: string;
  uploadProgress: number;
  status: 'uploading' | 'completed' | 'error';
}

export interface ShareSettings {
  expirationTime: number; // in hours
  maxDownloads?: number;
  requirePassword?: boolean;
  password?: string;
}