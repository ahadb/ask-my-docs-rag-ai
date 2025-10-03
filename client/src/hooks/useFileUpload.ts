import { useState, useCallback, useRef } from 'react';

export interface FileUploadState {
  uploadedFiles: File[];
  isUploading: boolean;
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface FileUploadActions {
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDragOver: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  clearFiles: () => void;
  openFileDialog: () => void;
}

export interface UseFileUploadReturn extends FileUploadState, FileUploadActions {}

export function useFileUpload(): UseFileUploadReturn {
  // File state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File selection handler
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prevFiles => [...prevFiles, ...fileArray]);
    }
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prevFiles => [...prevFiles, ...fileArray]);
    }
  }, []);

  // Utility functions
  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    // State
    uploadedFiles,
    isUploading,
    isDragOver,
    fileInputRef,
    
    // Actions
    setUploadedFiles,
    setIsUploading,
    setIsDragOver,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFiles,
    openFileDialog,
  };
}
