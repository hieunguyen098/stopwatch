"use client";
import React, { useState } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMessages } from "./components/ChatMessages";
import { WelcomeSection } from "./components/WelcomeSection";
import { ChatInput } from "./components/ChatInput";
import { HelloKittyIcon } from "./components/HelloKittyIcon";
import { ModelSelector } from "./components/ModelSelector";
import { useChatHistory, useChat } from "./hooks";
import { ChatHistory } from "./types";

export default function ChatAI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const { chatHistory, refreshChatHistory, isLoading } = useChatHistory();
  const {
    messages,
    input,
    setInput,
    isSending,
    error,
    createNewChat,
    loadChat,
    sendMessage,
    currentConversationId,
    isContinuingConversation,
  } = useChat(refreshChatHistory, selectedModel);

  const welcomeText = "Ngọc Smart's AI";
  const welcomeDescription =
    "Hey beautiful! You're capable of amazing things, and I believe in your strength and wisdom. Whether you need help solving problems, want to talk through ideas, or just need someone to listen, I'm here for you. Remember: you've got this, and you're never alone. Let's tackle whatever's on your mind today!";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const handleLoadChat = (chat: ChatHistory) => {
    loadChat(chat.messages, chat.id);
  };

  // Handle message regeneration
  const handleRegenerateMessage = (messageIndex: number) => {
    // Get the last user message before this AI message
    const userMessages = messages
      .slice(0, messageIndex)
      .filter((m) => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];

    if (lastUserMessage) {
      // Re-send the last user message to regenerate the AI response
      setInput(lastUserMessage.content);
      sendMessage();
    }
  };

  // Handle message editing
  const handleEditMessage = (messageIndex: number, newContent: string) => {
    // This would need to be implemented in your chat hook
    // For now, just log the action
    console.log(`Edit message ${messageIndex} to: ${newContent}`);
    // You could implement this by updating the messages array
    // and potentially re-sending from that point
  };

  // Handle conversation deletion
  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh chat history to remove deleted conversation
        await refreshChatHistory();

        // If the deleted chat was currently loaded, start a new chat
        if (currentConversationId === chatId) {
          createNewChat();
        }
      } else {
        console.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  // Close model selector when clicking outside
  const handleBackgroundClick = () => {
    if (isModelSelectorOpen) {
      setIsModelSelectorOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full bg-gradient-to-b from-pink-500 to-pink-100 relative overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Minimal Care Message - Performance Optimized */}
      <div className="fixed top-4 right-4 pointer-events-none z-[9999]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-pink-700 font-medium text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-pink-200"
        >
          Take care of yourself! 💖
        </motion.div>
      </div>

      {/* Backdrop overlay when sidebar is open */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={chatHistory}
        onNewChat={createNewChat}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        isLoading={isLoading}
      />

      {/* Main Chat Area */}
      <div
        className={`flex flex-col overflow-visible transition-all duration-300 min-h-screen ${
          isSidebarOpen ? "ml-80" : "ml-0"
        }`}
      >
        {/* Top Bar with Toggle and Model Selector */}
        <div className="flex justify-between items-center p-4 relative overflow-visible">
          {/* Toggle Sidebar Button */}
          {!isSidebarOpen && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-pink-500 hover:text-pink-600 cursor-pointer"
            >
              ☰
            </motion.button>
          )}

          {/* Spacer when sidebar is open */}
          {isSidebarOpen && <div></div>}

          {/* Model Selector */}
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            isOpen={isModelSelectorOpen}
            onToggle={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
          />
        </div>

        {/*<BackgroundElements />*/}

        <div className="container mx-auto px-4 py-2 min-h-screen flex flex-col">
          {/* Hello Kitty Icon at the top */}
          <HelloKittyIcon />

          <WelcomeSection
            welcomeText={welcomeText}
            welcomeDescription={welcomeDescription}
          />

          {/* Chat Container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={`flex-1 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 flex flex-col mx-auto w-full transition-all duration-300 ${
              isSidebarOpen ? "max-w-4xl" : "max-w-6xl"
            }`}
          >
            {/* Conversation Status */}
            {(isContinuingConversation || messages.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 border-b border-pink-200 rounded-t-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-pink-600">
                    {isContinuingConversation ? (
                      <>
                        <span>💬</span>
                        <span>Continuing conversation</span>
                        <span className="text-xs bg-pink-200 px-2 py-1 rounded-full">
                          ID: {currentConversationId?.slice(-8)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        <span>New conversation</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-pink-500">
                    <span>🤖</span>
                    <span>{selectedModel}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <ChatMessages
              messages={messages}
              isLoading={isSending}
              error={error}
              onRegenerateMessage={handleRegenerateMessage}
              onEditMessage={handleEditMessage}
            />

            <ChatInput
              input={input}
              isLoading={isSending}
              onInputChange={(e) => setInput(e.target.value)}
              onSubmit={handleSubmit}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-8 text-pink-500"
          >
            <p>Made with 💖 by Hello Kitty</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
