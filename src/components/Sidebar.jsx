import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiX } from "react-icons/fi";

export default function Sidebar({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);

  // Simulasi data history
  useEffect(() => {
    // Ini hanya contoh, nantinya bisa diambil dari localStorage atau API
    setHistory([
      { id: 1, name: "laporan-keuangan.pdf", date: "2023-09-15" },
      { id: 2, name: "data-mahasiswa.docx", date: "2023-09-10" },
      { id: 3, name: "notes.txt", date: "2023-09-05" },
    ]);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 h-full w-64 glass-effect z-10"
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Riwayat</h2>
              <motion.button
                onClick={onClose}
                className="text-gray-300 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX size={20} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {history.length > 0 ? (
                <ul className="space-y-2">
                  {history.map((item) => (
                    <motion.li
                      key={item.id}
                      className="glass-effect p-3 rounded cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.date}</p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-gray-400">
                  <p>Tidak ada riwayat</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
