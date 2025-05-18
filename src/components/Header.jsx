import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlusSquare, FiMenu } from 'react-icons/fi';
import { useFile } from '../context/FileContext';

export default function Header({ onToggleSidebar }) {
  const { clearFile } = useFile();
  
  const handleNewFile = () => {
    clearFile();
  };

  return (
    <header className="glass-effect p-4 flex items-center justify-between">
      <motion.button
        className="text-gray-300 hover:text-white"
        onClick={onToggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={24} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-center">AI Volar</h1>
      </motion.div>

      <motion.button
        className="text-gray-300 hover:text-white"
        onClick={handleNewFile}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="New file"
      >
        <FiPlusSquare size={24} />
      </motion.button>
    </header>
  );
} 