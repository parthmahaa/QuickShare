// src/utils/useUpload.ts

import { useState } from "react";

// Define the structure of the successful response from your backend
interface UploadResponse {
  shareId: string;
  shareLink: string;
  shareCode: string;
}

// Define the options for our upload function, including the new callback
interface UploadOptions {
  files: File[];
  onUploadProgress?: (progress: number) => void;
}

// Define the structure of the return value
type UploadResult = UploadResponse & { error?: string };
type UploadFunction = (options: UploadOptions) => Promise<UploadResult>;

export default function useUpload(): [UploadFunction, { loading: boolean }] {
  const [loading, setLoading] = useState(false);

  // This function now returns a Promise that wraps the XHR logic
  const upload = ({ files, onUploadProgress }: UploadOptions): Promise<UploadResult> => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Attach the progress event listener to track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onUploadProgress) {
          const percentage = (event.loaded / event.total) * 100;
          onUploadProgress(percentage);
        }
      });

      // Handle successful completion of the upload
      xhr.addEventListener("load", () => {
        setLoading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText) as UploadResponse;
          resolve(response);
        } else {
          reject(new Error(xhr.responseText || "Upload failed with status: " + xhr.status));
        }
      });

      // Handle network errors
      xhr.addEventListener("error", () => {
        setLoading(false);
        reject(new Error("A network error occurred during the upload."));
      });

      // Set up and send the request
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