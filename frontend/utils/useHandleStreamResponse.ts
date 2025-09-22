"use client";

import { useState } from "react";

export default function useHandleStreamResponse() {
  const [loading, setLoading] = useState(false);

  const handleStreamResponse = async (res: Response): Promise<string> => {
    setLoading(true);
    try {
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  return { handleStreamResponse, loading };
}
