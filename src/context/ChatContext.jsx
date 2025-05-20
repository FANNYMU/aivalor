import { createContext, useState, useContext } from "react";
import { askQuestion } from "../services/ai";

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const [chatState, setChatState] = useState({
    messages: [],
    isLoading: false,
    error: null,
  });

  /**
   * Menambahkan pesan pengguna ke riwayat chat
   * @param {string} message - Pesan dari pengguna
   */
  const addUserMessage = (message) => {
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "user", content: message }],
    }));
  };

  /**
   * Menambahkan pesan AI ke riwayat chat
   * @param {string} message - Pesan dari AI
   */
  const addAIMessage = (message) => {
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: "assistant", content: message }],
    }));
  };

  /**
   * Mengirim pertanyaan ke AI dan menambahkan jawaban ke riwayat chat
   * @param {string} question - Pertanyaan untuk AI
   * @param {string} fileContent - Isi file yang akan digunakan sebagai konteks
   */
  const sendQuestion = async (question, fileContent) => {
    if (!question.trim() || !fileContent) return;

    addUserMessage(question);

    setChatState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const answer = await askQuestion(question, fileContent);

      addAIMessage(answer);

      setChatState((prev) => ({
        ...prev,
        isLoading: false,
      }));

      return answer;
    } catch (error) {
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error.message || "Terjadi kesalahan saat berkomunikasi dengan AI",
      }));
    }
  };

  /**
   * Menghapus semua pesan chat
   */
  const clearChat = () => {
    setChatState({
      messages: [],
      isLoading: false,
      error: null,
    });
  };

  const value = {
    ...chatState,
    sendQuestion,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
