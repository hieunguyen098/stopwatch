import React from "react";
import * as motion from "motion/react-client";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <motion.form
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      onSubmit={onSubmit}
      className="p-6 border-t border-pink-200 bg-white/80"
    >
      <div className="flex space-x-4">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={input}
          onChange={onInputChange}
          placeholder="Type your message to Hello Kitty..."
          className="flex-1 p-4 border-2 border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 text-pink-800 placeholder-pink-300 bg-white/90 transition-all duration-300 text-lg"
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-8 py-4 bg-pink-400 text-white rounded-full hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-300 flex items-center group text-lg cursor-pointer"
        >
          <span className="mr-2">Send</span>
          <motion.span
            animate={{ rotate: [0, 12, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="transform"
          >
            🎀
          </motion.span>
        </motion.button>
      </div>
    </motion.form>
  );
};
