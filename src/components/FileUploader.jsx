import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { useFile } from "../context/FileContext";
import { FiUploadCloud, FiFile } from "react-icons/fi";

export default function FileUploader() {
  const { uploadFile, file, isLoading, error } = useFile();

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
    [uploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        {...getRootProps()}
        className={`glass-effect p-8 rounded-lg border-2 border-dashed ${
          isDragActive ? "border-blue-500" : "border-gray-500"
        } cursor-pointer transition-all hover:border-blue-400 flex flex-col items-center justify-center text-center`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ scale: isDragActive ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-4"
        >
          {file ? (
            <FiFile size={48} className="text-blue-400 mx-auto" />
          ) : (
            <FiUploadCloud size={48} className="text-gray-400 mx-auto" />
          )}
        </motion.div>

        {file ? (
          <div>
            <p className="text-lg font-medium mb-2">{file.name}</p>
            <p className="text-sm text-gray-400">
              {Math.round(file.size / 1024)} KB
            </p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            <p className="text-lg">Memproses file...</p>
            <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg">
              {isDragActive
                ? "Letakkan file di sini..."
                : "Masukan File PDF, DOCX, TXT, dll"}
            </p>
            <p className="text-sm text-gray-400">
              Seret dan letakkan file di sini, atau klik untuk memilih file
            </p>
          </div>
        )}

        {error && (
          <motion.p
            className="text-red-500 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
