import React, { useState } from "react";
import * as motion from "motion/react-client";

interface MessageActionsProps {
  messageContent: string;
  isAI: boolean;
  onRegenerate?: () => void;
  onEdit?: () => void;
  messageIndex: number;
  children: React.ReactNode;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  messageContent,
  isAI,
  onRegenerate,
  onEdit,
  messageIndex,
  children,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [reactionFeedback, setReactionFeedback] = useState<string | null>(null);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const copyFullMessage = () => {
    copyToClipboard(messageContent, "message");
  };

  const extractCodeBlocks = () => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    return messageContent.match(codeBlockRegex) || [];
  };

  const shareMessage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Chat Message",
          text: messageContent,
        });
      } catch {
        // Fallback to clipboard
        copyToClipboard(messageContent, "shared");
      }
    } else {
      copyToClipboard(messageContent, "shared");
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {children}

      {/* Show selected reaction indicator */}
      {selectedReaction && !showActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 bg-pink-100 border-2 border-pink-300 rounded-full p-1 text-xs shadow-md"
          style={{
            [isAI ? "right" : "left"]: "8px",
          }}
        >
          {selectedReaction}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{
          opacity: showActions ? 1 : 0,
          y: showActions ? 0 : 5,
        }}
        className={`absolute top-2 flex gap-0.5 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-pink-200 z-10 max-w-fit`}
        style={{
          [isAI ? "right" : "left"]: "8px",
          transform: isAI ? "translateX(0%)" : "translateX(0%)",
        }}
      >
        {/* Copy Message */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyFullMessage}
          className="p-1.5 text-pink-600 hover:text-pink-800 hover:bg-pink-50 rounded-md transition-colors text-xs"
          title="Copy message"
        >
          {copiedText === "message" ? "✅" : "📋"}
        </motion.button>

        {/* Copy Code Blocks */}
        {extractCodeBlocks().length > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const codes = extractCodeBlocks().join("\n\n");
              copyToClipboard(codes, "code");
            }}
            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-colors text-xs"
            title="Copy all code"
          >
            {copiedText === "code" ? "✅" : "💻"}
          </motion.button>
        )}

        {/* Share */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareMessage}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors text-xs"
          title="Share message"
        >
          {copiedText === "shared" ? "✅" : "🔗"}
        </motion.button>

        {/* Regenerate (AI messages only) */}
        {isAI && onRegenerate && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRegenerate}
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors text-xs"
            title="Regenerate response"
          >
            🔄
          </motion.button>
        )}

        {/* Edit (User messages only) */}
        {!isAI && onEdit && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors text-xs"
            title="Edit message"
          >
            ✏️
          </motion.button>
        )}
      </motion.div>

      {/* Feedback Section (AI messages only) */}
      {isAI && showActions && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`absolute top-14 flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-pink-200 max-w-fit`}
          style={{
            [isAI ? "right" : "left"]: "8px",
          }}
        >
          <span className="text-xs text-pink-600 mr-2">Rate:</span>
          {["👍", "❤️", "🎯", "👎"].map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                // Toggle reaction: if same emoji clicked, remove it; otherwise set new one
                const newReaction = selectedReaction === emoji ? null : emoji;
                setSelectedReaction(newReaction);

                // Show feedback message
                if (newReaction) {
                  setReactionFeedback(`Reacted with ${emoji}`);
                } else {
                  setReactionFeedback(`Removed reaction`);
                }

                // Clear feedback after 2 seconds
                setTimeout(() => setReactionFeedback(null), 2000);

                // Here you could save feedback to your backend
                console.log(
                  `Feedback for message ${messageIndex}: ${
                    newReaction || "removed"
                  }`
                );
              }}
              className={`text-sm rounded p-1 transition-all ${
                selectedReaction === emoji
                  ? "bg-pink-200 border-2 border-pink-400 scale-110"
                  : "hover:bg-pink-50 border-2 border-transparent"
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Copy Success Toast */}
      {copiedText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          className="absolute top-16 bg-green-500 text-white px-3 py-1 rounded-lg text-xs shadow-lg z-20 whitespace-nowrap"
          style={{
            [isAI ? "right" : "left"]: "8px",
          }}
        >
          Copied {copiedText}! ✨
        </motion.div>
      )}

      {/* Reaction Feedback Toast */}
      {reactionFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          className="absolute top-20 bg-purple-500 text-white px-3 py-1 rounded-lg text-xs shadow-lg z-20 whitespace-nowrap"
          style={{
            [isAI ? "right" : "left"]: "8px",
          }}
        >
          {reactionFeedback} 💫
        </motion.div>
      )}
    </div>
  );
};
