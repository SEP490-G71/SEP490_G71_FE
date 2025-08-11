import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

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
    } catch (error: any) {
      console.error("Lỗi khi tải lịch sử chat:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Có lỗi xảy ra khi tải lịch sử chat.";

      toast.error(message);
    }
  };

  return { messages, fetchChatHistory, setMessages };
}
