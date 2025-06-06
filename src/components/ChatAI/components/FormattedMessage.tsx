import React from "react";
import * as motion from "motion/react-client";

interface FormattedMessageProps {
  content: string;
  isAI?: boolean;
}

interface InlinePart {
  key: number;
  type: "code" | "bold" | "italic" | "link";
  content: string;
  url?: string;
  placeholder: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
  content,
  isAI = false,
}) => {
  // Parse and format the content
  const formatContent = (text: string) => {
    const lines = text.split("\n");
    const elements: React.JSX.Element[] = [];
    let codeBlockContent = "";
    let isInCodeBlock = false;
    let codeLanguage = "";
    let listItems: string[] = [];
    let isInList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <motion.ul
            key={`list-${elements.length}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="list-disc list-inside space-y-2 my-4 ml-4"
          >
            {listItems.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: elements.length * 0.1 + index * 0.05,
                }}
                className="text-sm leading-relaxed"
              >
                {formatInlineText(item)}
              </motion.li>
            ))}
          </motion.ul>
        );
        listItems = [];
        isInList = false;
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent) {
        elements.push(
          <motion.div
            key={`code-${elements.length}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="my-4"
          >
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-pink-200/30">
              {codeLanguage && (
                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-300 border-b border-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                    <span className="ml-2">{codeLanguage}</span>
                  </span>
                </div>
              )}
              <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                <code>{codeBlockContent}</code>
              </pre>
            </div>
          </motion.div>
        );
        codeBlockContent = "";
        codeLanguage = "";
      }
    };

    lines.forEach((line) => {
      // Handle code blocks
      if (line.trim().startsWith("```")) {
        if (!isInCodeBlock) {
          flushList();
          isInCodeBlock = true;
          codeLanguage = line.trim().slice(3) || "text";
        } else {
          isInCodeBlock = false;
          flushCodeBlock();
        }
        return;
      }

      if (isInCodeBlock) {
        codeBlockContent += (codeBlockContent ? "\n" : "") + line;
        return;
      }

      // Handle list items
      if (line.trim().match(/^[•\-\*]\s+/) || line.trim().match(/^\d+\.\s+/)) {
        const listItem = line
          .trim()
          .replace(/^[•\-\*]\s+/, "")
          .replace(/^\d+\.\s+/, "");
        listItems.push(listItem);
        isInList = true;
        return;
      } else if (isInList && line.trim() === "") {
        // Continue list if empty line
        return;
      } else if (isInList) {
        flushList();
      }

      // Handle headings
      if (line.startsWith("###")) {
        elements.push(
          <motion.h4
            key={`h4-${elements.length}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="text-lg font-semibold text-pink-700 mt-6 mb-3 flex items-center gap-2"
          >
            <span className="text-pink-400">✨</span>
            {line.replace("###", "").trim()}
          </motion.h4>
        );
      } else if (line.startsWith("##")) {
        elements.push(
          <motion.h3
            key={`h3-${elements.length}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="text-xl font-semibold text-pink-700 mt-6 mb-4 flex items-center gap-2"
          >
            <span className="text-pink-400">🌟</span>
            {line.replace("##", "").trim()}
          </motion.h3>
        );
      } else if (line.startsWith("#")) {
        elements.push(
          <motion.h2
            key={`h2-${elements.length}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="text-2xl font-bold text-pink-700 mt-8 mb-4 flex items-center gap-2"
          >
            <span className="text-pink-400">⭐</span>
            {line.replace("#", "").trim()}
          </motion.h2>
        );
      } else if (line.trim() === "") {
        // Handle empty lines as spacing
        if (elements.length > 0) {
          elements.push(
            <div key={`space-${elements.length}`} className="h-2"></div>
          );
        }
      } else if (line.trim().startsWith(">")) {
        // Handle blockquotes
        elements.push(
          <motion.blockquote
            key={`quote-${elements.length}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="border-l-4 border-pink-300 pl-4 py-2 my-4 bg-pink-50/50 rounded-r-lg italic text-pink-700"
          >
            {formatInlineText(line.replace(">", "").trim())}
          </motion.blockquote>
        );
      } else {
        // Handle regular paragraphs
        elements.push(
          <motion.p
            key={`p-${elements.length}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: elements.length * 0.1 }}
            className="leading-relaxed mb-3 text-sm"
          >
            {formatInlineText(line)}
          </motion.p>
        );
      }
    });

    // Flush any remaining content
    flushList();
    flushCodeBlock();

    return elements;
  };

  // Format inline text (bold, italic, code, links)
  const formatInlineText = (text: string) => {
    const parts: InlinePart[] = [];
    let currentText = text;
    let key = 0;

    // Handle inline code first
    currentText = currentText.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__CODE_${key}__`;
      parts.push({
        key: key++,
        type: "code",
        content: code,
        placeholder,
      });
      return placeholder;
    });

    // Handle bold text
    currentText = currentText.replace(/\*\*([^*]+)\*\*/g, (match, bold) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push({
        key: key++,
        type: "bold",
        content: bold,
        placeholder,
      });
      return placeholder;
    });

    // Handle italic text
    currentText = currentText.replace(/\*([^*]+)\*/g, (match, italic) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push({
        key: key++,
        type: "italic",
        content: italic,
        placeholder,
      });
      return placeholder;
    });

    // Handle links
    currentText = currentText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, linkText, url) => {
        const placeholder = `__LINK_${key}__`;
        parts.push({
          key: key++,
          type: "link",
          content: linkText,
          url: url,
          placeholder,
        });
        return placeholder;
      }
    );

    // Split by placeholders and rebuild with components
    let result: (string | React.JSX.Element)[] = [currentText];

    parts.forEach((part) => {
      const newResult: (string | React.JSX.Element)[] = [];
      result.forEach((item) => {
        if (typeof item === "string" && item.includes(part.placeholder)) {
          const splitParts = item.split(part.placeholder);
          newResult.push(splitParts[0]);

          switch (part.type) {
            case "code":
              newResult.push(
                <code
                  key={part.key}
                  className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-mono"
                >
                  {part.content}
                </code>
              );
              break;
            case "bold":
              newResult.push(
                <strong key={part.key} className="font-semibold text-pink-800">
                  {part.content}
                </strong>
              );
              break;
            case "italic":
              newResult.push(
                <em key={part.key} className="italic text-pink-700">
                  {part.content}
                </em>
              );
              break;
            case "link":
              newResult.push(
                <a
                  key={part.key}
                  href={part.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 underline decoration-pink-300 hover:decoration-pink-500 transition-colors"
                >
                  {part.content}
                </a>
              );
              break;
          }

          newResult.push(splitParts[1]);
        } else {
          newResult.push(item);
        }
      });
      result = newResult;
    });

    return result.filter((item) => item !== undefined && item !== "");
  };

  return (
    <div className="formatted-message">
      {isAI && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-3 text-pink-600"
        >
          <span className="text-lg">🤖</span>
          <span className="text-xs font-medium opacity-75">AI Assistant</span>
        </motion.div>
      )}
      <div className="space-y-1">{formatContent(content)}</div>
    </div>
  );
};
