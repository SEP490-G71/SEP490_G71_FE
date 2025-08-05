import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { ChatMessage } from "../../hooks/DashBoard/useChat";
import axiosInstance from "../../services/axiosInstance";

interface ChatbotWidgetProps {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}

export default function ChatbotWidget({
  messages,
  setMessages,
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const question = input;
    setInput("");
    setIsLoading(true);

    const newMsg: ChatMessage = { question, answer: "" };
    setMessages((prev) => [...prev, newMsg]);
    setTypingIndex(messages.length);
    setCurrentAnswer("");

    try {
      const res = await axiosInstance.post("/chats", { question });
      const fullAnswer: string = res.data.result || "Không có phản hồi.";

      const typeOutAnswer = async (text: string) => {
        for (let i = 0; i < text.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 20));
          setCurrentAnswer((prev) => prev + text[i]);
        }

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { question, answer: text },
        ]);
        setTypingIndex(null);
      };

      await typeOutAnswer(fullAnswer);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { question, answer: "Lỗi khi gửi câu hỏi." },
      ]);
      setTypingIndex(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAnswer, isLoading]);

  // ✅ Scroll xuống đáy khi mở lại chatbot
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 0); // hoặc requestAnimationFrame(() => ...)
      return () => clearTimeout(timeout);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
          title="Mở chatbot"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="relative w-[400px] h-[520px] bg-white border border-gray-300 rounded-lg shadow-lg p-3 flex flex-col">
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
            title="Đóng chatbot"
          >
            ×
          </button>

          <div className="text-lg font-semibold mb-2">Chatbot</div>

          <div className="flex-1 overflow-auto border p-2 text-sm rounded bg-gray-50 space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-1">
                {msg.question && (
                  <div className="text-right ml-auto max-w-[80%]">
                    <div className="inline-block bg-blue-100 text-blue-800 px-3 py-2 rounded-lg shadow-sm">
                      {msg.question}
                    </div>
                  </div>
                )}
                {typingIndex === idx ? (
                  <div className="text-left mr-auto max-w-[80%]">
                    <div className="inline-block bg-gray-200 text-gray-800 px-3 py-2 rounded-lg shadow-sm">
                      {currentAnswer}
                      <span className="animate-pulse">▋</span>
                    </div>
                  </div>
                ) : (
                  msg.answer && (
                    <div className="text-left mr-auto max-w-[80%]">
                      <div className="inline-block bg-gray-200 text-gray-800 px-3 py-2 rounded-lg shadow-sm">
                        {msg.answer}
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              className="flex-1 p-2 border rounded text-sm"
              type="text"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
