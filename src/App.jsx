import { useState } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FileUploader from "./components/FileUploader";
import ChatInterface from "./components/ChatInterface";
import UserAvatar from "./components/UserAvatar";

import { motion } from "framer-motion";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import FileUploader from "./components/FileUploader";
import ChatInterface from "./components/ChatInterface";
import UserAvatar from "./components/UserAvatar";
import { FileProvider } from "./context/FileContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <FileProvider>
      <ChatProvider>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-black">
          <Header onToggleSidebar={toggleSidebar} />
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="flex-1 p-4 md:p-6 container mx-auto">
            <div className="flex justify-end mb-4">
              <UserAvatar />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <FileUploader />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ChatInterface />
            </motion.div>
          </main>

          <footer className="text-center text-sm text-gray-500 p-4">
            © {new Date().getFullYear()} AI Volar - Semua pertanyaan dijawab
            dengan Groq AI
          </footer>
        </div>
      </ChatProvider>
    </FileProvider>
  );
}

export default App;
