import { useState } from "react";
import { Message } from "../types";

export const useChat = (
  onNewConversation?: () => void,
  selectedModel?: string
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  const createNewChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    setCurrentConversationId(null);
  };

  const loadChat = (messages: Message[], conversationId?: string) => {
    setMessages(messages);
    setError(null);
    setCurrentConversationId(conversationId || null);
  };

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const isNewConversation = messages.length === 0 && !currentConversationId;

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId: currentConversationId, // Send the current conversation ID if continuing
          model: selectedModel || "gpt-4o", // Send the selected model
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const newMessages = [
        ...messages,
        userMessage,
        { role: "assistant" as const, content: data.message },
      ];
      setMessages(newMessages);

      // Update conversation ID if we got a new one
      if (data.completionId && !currentConversationId) {
        setCurrentConversationId(data.completionId);
      }

      // If this was a new conversation, notify parent to refresh history
      if (isNewConversation && onNewConversation) {
        setTimeout(() => {
          onNewConversation();
        }, 1000); // Wait for OpenAI to process and store the completion
      }
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isSending,
    error,
    createNewChat,
    loadChat,
    sendMessage,
    currentConversationId,
    isContinuingConversation: !!currentConversationId,
  };
};
