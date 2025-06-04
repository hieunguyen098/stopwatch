export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
  messages: Message[];
}
