import React, { useRef, useEffect } from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import { Message } from "../types";
import { FormattedMessage } from "./FormattedMessage";
import { MessageActions } from "./MessageActions";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  onRegenerateMessage?: (messageIndex: number) => void;
  onEditMessage?: (messageIndex: number, newContent: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  error,
  onRegenerateMessage,
  onEditMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
      {/* Beautiful Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,182,193,0.1)_0%,transparent_50%)]"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(255, 192, 203, 0.1) 2px, transparent 2px),
          radial-gradient(circle at 75% 75%, rgba(221, 160, 221, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px, 30px 30px",
          backgroundPosition: "0 0, 25px 25px",
        }}
      ></div>

      {/* Subtle Static Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Static decorative elements - much lighter on performance */}
        <div className="absolute top-20 left-20 text-pink-300 text-xl opacity-20">
          💕
        </div>
        <div className="absolute top-40 right-32 text-yellow-300 text-lg opacity-20">
          ⭐
        </div>
        <div className="absolute bottom-32 left-16 text-pink-400 text-lg opacity-20">
          🎀
        </div>
        <div className="absolute top-60 left-1/2 text-purple-300 text-sm opacity-20">
          ✨
        </div>
        <div className="absolute bottom-20 right-20 text-pink-300 text-lg opacity-20">
          🐱
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative z-10">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className={`max-w-[80%] rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-pink-200"
                    : "bg-white/90 text-pink-800 border border-pink-200 shadow-purple-100"
                }`}
              >
                <MessageActions
                  messageContent={message.content}
                  isAI={message.role === "assistant"}
                  messageIndex={index}
                  onRegenerate={
                    message.role === "assistant" && onRegenerateMessage
                      ? () => onRegenerateMessage(index)
                      : undefined
                  }
                  onEdit={
                    message.role === "user" && onEditMessage
                      ? () => {
                          const newContent = prompt(
                            "Edit your message:",
                            message.content
                          );
                          if (newContent && newContent !== message.content) {
                            onEditMessage(index, newContent);
                          }
                        }
                      : undefined
                  }
                >
                  <div className="relative">
                    <FormattedMessage
                      content={message.content}
                      isAI={message.role === "assistant"}
                    />
                    {/* Message decorative element */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                        message.role === "user" ? "bg-pink-300" : "bg-pink-400"
                      } opacity-60`}
                    ></div>
                  </div>
                </MessageActions>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-pink-200 text-pink-600 rounded-2xl p-4 shadow-lg">
              <div className="flex space-x-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-3 h-3 bg-pink-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  className="w-3 h-3 bg-pink-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 bg-pink-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-red-100/90 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl p-4 shadow-lg">
              {error}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
