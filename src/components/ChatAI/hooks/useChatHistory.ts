import { useState, useEffect } from "react";
import { ChatHistory } from "../types";

export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat?limit=50&order=desc");
      if (response.ok) {
        const data = await response.json();
        const openAIHistory = data.data || [];

        // Sort by timestamp (newest first)
        openAIHistory.sort(
          (a: ChatHistory, b: ChatHistory) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setChatHistory(openAIHistory);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setChatHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshChatHistory = async () => {
    await loadChatHistory();
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  return {
    chatHistory,
    refreshChatHistory,
    isLoading,
  };
};
