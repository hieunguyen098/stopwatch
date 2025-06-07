import React from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { ChatHistory } from "../types";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: ChatHistory[];
  onNewChat: () => void;
  onLoadChat: (chat: ChatHistory) => void;
  onDeleteChat: (chatId: string) => void;
  isLoading?: boolean;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  chatHistory,
  onNewChat,
  onLoadChat,
  onDeleteChat,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-50 w-80 bg-white/90 backdrop-blur-sm border-r border-pink-200 h-screen overflow-y-auto"
    >
      <div className="p-4 border-b border-pink-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-pink-600">Chat History</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-pink-500 hover:text-pink-600 cursor-pointer"
          >
            ✕
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full py-2 px-4 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>New Chat</span>
          <span>✨</span>
        </motion.button>
      </div>
      <div className="divide-y divide-pink-100">
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center"
            >
              <div className="animate-spin text-pink-400 mb-2">⭐</div>
              <p className="text-sm text-pink-500">Loading conversations...</p>
            </motion.div>
          ) : chatHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center"
            >
              <div className="text-pink-400 mb-2">💬</div>
              <p className="text-sm text-pink-500">
                No conversations yet.
                <br />
                Start a new chat to see your history here!
              </p>
            </motion.div>
          ) : (
            chatHistory.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ backgroundColor: "rgba(249, 168, 212, 0.1)" }}
                className="p-4 hover:bg-pink-50 transition-colors relative group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => onLoadChat(chat)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-pink-800 line-clamp-2 pr-8">
                      {chat.title}
                    </h3>
                    <span className="text-xs text-pink-400 flex-shrink-0 ml-2">
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-pink-600 truncate">
                    {chat.preview}
                  </p>
                  <div className="text-xs text-pink-400 mt-1">
                    {chat.messages.length} messages
                  </div>
                </div>

                {/* Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Are you sure you want to delete this conversation?"
                      )
                    ) {
                      onDeleteChat(chat.id);
                    }
                  }}
                  className=" p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Delete conversation"
                >
                  🗑️
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
