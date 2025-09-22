"use client";

import { useState } from "react";

interface UploadResult {
  shareId: string;
  shareLink: string;
  shareCode: string;
  error?: string;
}

interface UseUploadOptions {
  files: File[];
}

export default function useUpload(): [
  (options: UseUploadOptions) => Promise<UploadResult>,
  { loading: boolean }
] {
  const [loading, setLoading] = useState(false);

  const upload = async ({ files }: UseUploadOptions): Promise<UploadResult> => {
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append("file", file)); // Append each file with the same key "file"

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      const data: UploadResult = await res.json();
      return data;
    } catch (err) {
      return { shareId: "", shareLink: "", shareCode: "", error: (err as Error).message };
    } finally {
      setLoading(false);
    }
  };

  return [upload, { loading }];
}