
import { useState } from "react";

interface UploadResponse {
  shareId: string;
  shareLink: string;
  shareCode: string;
}

interface UploadOptions {
  files: File[];
  onUploadProgress?: (progress: number) => void;
}

type UploadResult = UploadResponse & { error?: string };
type UploadFunction = (options: UploadOptions) => Promise<UploadResult>;

export default function useUpload(): [UploadFunction, { loading: boolean }] {
  const [loading, setLoading] = useState(false);

  const upload = ({ files, onUploadProgress }: UploadOptions): Promise<UploadResult> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onUploadProgress) {
          const percentage = (event.loaded / event.total) * 100;
          onUploadProgress(percentage);
        }
      });

      xhr.addEventListener("load", () => {
        setLoading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText) as UploadResponse;
          resolve(response);
        } else {
          reject(new Error(xhr.responseText || "Upload failed with status: " + xhr.status));
        }
      });

      xhr.addEventListener("error", () => {
        setLoading(false);
        reject(new Error("A network error occurred during the upload."));
      });

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/upload`;
      xhr.open("POST", apiUrl, true);
      xhr.send(formData);
    });
  };

  return [upload, { loading }];
}