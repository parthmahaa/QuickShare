export const generateShareCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const generateShareLink = (): string => {
  const baseUrl = window.location.origin;
  const shareId = crypto.randomUUID();
  return `${baseUrl}/share/${shareId}`;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isFileExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};

export const getTimeUntilExpiration = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};