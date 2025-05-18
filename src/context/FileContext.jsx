import { createContext, useState, useContext } from 'react';
import { extractTextFromFile } from '../services/fileParser';

const FileContext = createContext();

export function useFile() {
  return useContext(FileContext);
}

export function FileProvider({ children }) {
  const [fileData, setFileData] = useState({
    file: null,
    fileName: '',
    fileContent: '',
    isLoading: false,
    error: null,
  });
  
  /**
   * Mengupload dan memproses file
   * @param {File} file - File yang diupload
   */
  const uploadFile = async (file) => {
    setFileData({
      file,
      fileName: file.name,
      fileContent: '',
      isLoading: true,
      error: null,
    });
    
    try {
      const text = await extractTextFromFile(file);
      
      setFileData(prev => ({
        ...prev,
        fileContent: text,
        isLoading: false,
      }));
      
      return text;
    } catch (error) {
      setFileData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Terjadi kesalahan saat memproses file',
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
      fileName: '',
      fileContent: '',
      isLoading: false,
      error: null,
    });
  };
  
  const value = {
    ...fileData,
    uploadFile,
    clearFile,
  };
  
  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
} 