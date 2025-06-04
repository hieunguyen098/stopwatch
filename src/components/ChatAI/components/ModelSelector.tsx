import React from "react";
import * as motion from "motion/react-client";

export interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const availableModels: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most capable model, best for complex tasks",
    icon: "🧠",
    recommended: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Faster and more cost-effective",
    icon: "⚡",
  },
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "High performance with large context",
    icon: "🚀",
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Original GPT-4, reliable and powerful",
    icon: "💎",
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and affordable for simple tasks",
    icon: "💫",
  },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  isOpen,
  onToggle,
}) => {
  const currentModel =
    availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  return (
    <div className="relative overflow-visible">
      {/* Model Selector Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm border border-pink-200 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer"
      >
        <span className="text-lg">{currentModel.icon}</span>
        <span className="text-sm font-medium text-pink-700">
          {currentModel.name}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-pink-400"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm border border-pink-200 rounded-2xl shadow-xl p-2 min-w-80"
          onClick={(e) => e.stopPropagation()}
          style={{
            zIndex: 9999,
          }}
        >
          <div className="mb-2 px-3 py-2">
            <h3 className="text-sm font-semibold text-pink-600">
              Choose AI Model
            </h3>
            <p className="text-xs text-pink-400">
              Select the model that best fits your needs
            </p>
          </div>

          {availableModels.map((model) => (
            <motion.button
              key={model.id}
              whileHover={{ backgroundColor: "rgba(249, 168, 212, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onModelChange(model.id);
                onToggle();
              }}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                selectedModel === model.id
                  ? "bg-pink-100 border border-pink-300"
                  : "hover:bg-pink-50"
              }`}
            >
              <span className="text-xl mt-0.5">{model.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-pink-800">{model.name}</h4>
                  {model.recommended && (
                    <span className="text-xs bg-gradient-to-r from-pink-400 to-purple-400 text-white px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                  {selectedModel === model.id && (
                    <span className="text-pink-500">✓</span>
                  )}
                </div>
                <p className="text-xs text-pink-500 mt-1">
                  {model.description}
                </p>
              </div>
            </motion.button>
          ))}

          <div className="mt-2 pt-2 border-t border-pink-100 px-3 py-2">
            <p className="text-xs text-pink-400">
              💡 Tip: GPT-4o is recommended for the best Hello Kitty experience!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
