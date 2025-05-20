import { createContext, useState, useContext } from "react";
import { extractTextFromFile } from "../services/fileParser";

const FileContext = createContext();

// Konstanta untuk ukuran file maksimum (1MB dalam bytes)
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export function useFile() {
  return useContext(FileContext);
}

export function FileProvider({ children }) {
  const [fileData, setFileData] = useState({
    file: null,
    fileName: "",
    fileContent: "",
    isLoading: false,
    error: null,
  });

  /**
   * Mengupload dan memproses file
   * @param {File} file - File yang diupload
   */
  const uploadFile = async (file) => {
    // Validasi ukuran file
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `Ukuran file terlalu besar. Maksimal 1MB, file Anda: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`;
      setFileData({
        file: null,
        fileName: file.name,
        fileContent: "",
        isLoading: false,
        error: errorMsg,
      });
      throw new Error(errorMsg);
    }

    setFileData({
      file,
      fileName: file.name,
      fileContent: "",
      isLoading: true,
      error: null,
    });

    try {
      const text = await extractTextFromFile(file);

      // Validasi ukuran teks yang diekstrak (opsional, untuk mencegah error Groq API)
      if (text.length > 12000) {
        throw new Error(
          "Konten file terlalu besar untuk diproses. Mohon gunakan file yang lebih kecil."
        );
      }

      setFileData((prev) => ({
        ...prev,
        fileContent: text,
        isLoading: false,
      }));

      return text;
    } catch (error) {
      setFileData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Terjadi kesalahan saat memproses file",
      }));
      throw error;
    }
  };

  /**
   * Menghapus file yang diupload
   */
  const clearFile = () => {
    setFileData({
      file: null,
      fileName: "",
      fileContent: "",
      isLoading: false,
      error: null,
    });
  };

  const value = {
    ...fileData,
    uploadFile,
    clearFile,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}
