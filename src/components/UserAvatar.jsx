import { motion } from 'framer-motion';

export default function UserAvatar() {
  // Mengambil inisial dari nama pengguna, untuk sementara menggunakan default
  const userInitial = 'CH';
  
  return (
    <motion.div
      className="h-10 w-10 rounded-full glass-effect flex items-center justify-center text-lg font-bold cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {userInitial}
    </motion.div>
  );
} 