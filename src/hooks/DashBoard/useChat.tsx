import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export interface ChatMessage {
  question: string;
  answer: string;
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fetchChatHistory = async () => {
    try {
      const res = await axiosInstance.get("/chats/history");
      const history = res.data.result || [];
      setMessages(history.reverse());
    } catch (error) {
      console.error("Lỗi khi tải lịch sử chat:", error);
    }
  };

  return { messages, fetchChatHistory, setMessages };
}
