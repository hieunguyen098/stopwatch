import React, { useState } from "react";
import * as motion from "motion/react-client";
import { FormattedMessage } from "./FormattedMessage";

export const FormattingExample: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState(0);

  const examples = [
    {
      title: "🌟 Rich Markdown Content",
      content: `# Welcome to Beautiful AI Chat! 

I'm here to help you with **amazing** formatting capabilities. Here's what I can do:

## ✨ Text Formatting
- **Bold text** for emphasis
- *Italic text* for style  
- \`inline code\` for technical terms
- [Beautiful links](https://example.com) that are clickable

## 🚀 Code Blocks
Here's a JavaScript example:

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}! 👋\`);
  return "Welcome to our AI chat!";
}

greetUser("Beautiful User");
\`\`\`

## 📝 Lists and Organization
### Features I support:
- Animated text rendering
- Syntax highlighting
- Beautiful code blocks
- Interactive links
- Emoji support 🎉

### Numbered Lists:
1. First, I parse your markdown
2. Then I create beautiful animations
3. Finally, I render with style!

> **Quote:** "The best AI experiences are both powerful and beautiful" - Smart AI Assistant

## 💡 Tips for Better Formatting
Want to make your AI responses look amazing? Use:
- Headings with \`#\`, \`##\`, \`###\`
- Lists with \`-\` or numbers
- Code with \`\`\`language\`\`\`
- Emphasis with \`**bold**\` and \`*italic*\`

That's how you create beautiful, formatted AI content! ✨`,
    },
    {
      title: "💻 Code Examples",
      content: `# Code Examples Collection

## Python Data Analysis
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

# Load and analyze data
df = pd.read_csv('data.csv')
result = df.groupby('category').sum()

# Create beautiful visualization
plt.figure(figsize=(10, 6))
plt.bar(result.index, result.values)
plt.title('Beautiful Data Visualization 📊')
plt.show()
\`\`\`

## React Component
\`\`\`tsx
interface Props {
  message: string;
  isAnimated?: boolean;
}

const BeautifulMessage: React.FC<Props> = ({ message, isAnimated = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="beautiful-message"
    >
      {message} ✨
    </motion.div>
  );
};
\`\`\`

## CSS Styling
\`\`\`css
.beautiful-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}
\`\`\`

Pretty cool, right? 🎨`,
    },
    {
      title: "📚 Educational Content",
      content: `# Learning Made Beautiful 

## 🧠 Understanding Algorithms

### Big O Notation
Understanding **time complexity** is crucial:

- \`O(1)\` - *Constant time* - Always fast! ⚡
- \`O(n)\` - *Linear time* - Scales with input
- \`O(n²)\` - *Quadratic time* - Gets slow quickly

### Example: Binary Search
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found it! 🎯
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found
\`\`\`

## 🌟 Key Benefits
1. **Visual Learning** - See concepts in action
2. **Interactive Examples** - Try it yourself
3. **Beautiful Formatting** - Easy to read and understand

> **Pro Tip:** The best way to learn programming is by doing! Start with small projects and gradually work your way up. 🚀

## 📖 Additional Resources
Check out these helpful links:
- [MDN Web Docs](https://developer.mozilla.org) for web development
- [Python Official Tutorial](https://docs.python.org/3/tutorial/) for Python
- [React Documentation](https://reactjs.org/docs) for React

Happy coding! 💻✨`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200"
    >
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-2xl font-bold text-pink-700 mb-6 text-center flex items-center justify-center gap-2"
      >
        <span>🎨</span>
        Beautiful AI Content Formatting Demo
      </motion.h2>

      {/* Example Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {examples.map((example, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedExample(index)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              selectedExample === index
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
          >
            {example.title}
          </motion.button>
        ))}
      </div>

      {/* Content Display */}
      <motion.div
        key={selectedExample}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-xl p-6 border border-pink-100"
      >
        <FormattedMessage
          content={examples[selectedExample].content}
          isAI={true}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-pink-600"
      >
        <p>
          💡 This is how your AI responses will look - beautiful, organized, and
          easy to read!
        </p>
      </motion.div>
    </motion.div>
  );
};
