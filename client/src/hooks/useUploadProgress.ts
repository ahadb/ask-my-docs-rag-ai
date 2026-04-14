import { useState, useCallback } from 'react';

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface FileProcessingStatus {
  fileName: string;
  status: 'uploading' | 'parsing' | 'chunking' | 'embedding' | 'storing' | 'completed' | 'error';
  progress: number;
  steps: ProcessingStep[];
  error?: string;
}

export interface UploadProgressState {
  fileProcessingStatus: FileProcessingStatus[];
  isProcessing: boolean;
  totalProgress: number;
  completedFiles: number;
  errorFiles: number;
}

export interface UploadProgressActions {
  setFileProcessingStatus: React.Dispatch<React.SetStateAction<FileProcessingStatus[]>>;
  updateFileStatus: (fileName: string, status: FileProcessingStatus['status'], progress: number, stepId: string, stepStatus: ProcessingStep['status'], stepProgress?: number) => void;
  addFileToProcessing: (fileName: string) => void;
  removeFileFromProcessing: (fileName: string) => void;
  clearAllProcessing: () => void;
  resetFileStatus: (fileName: string) => void;
}

export interface UseUploadProgressReturn extends UploadProgressState, UploadProgressActions {}

// Default processing steps for file upload
const DEFAULT_PROCESSING_STEPS: ProcessingStep[] = [
  { id: 'upload', name: 'Upload', status: 'pending', progress: 0 },
  { id: 'parse', name: 'Parse', status: 'pending', progress: 0 },
  { id: 'chunk', name: 'Chunk', status: 'pending', progress: 0 },
  { id: 'embed', name: 'Embed', status: 'pending', progress: 0 },
  { id: 'store', name: 'Store', status: 'pending', progress: 0 },
];

export function useUploadProgress(): UseUploadProgressReturn {
  const [fileProcessingStatus, setFileProcessingStatus] = useState<FileProcessingStatus[]>([]);

  // Add file to processing queue
  const addFileToProcessing = useCallback((fileName: string) => {
    const newFileStatus: FileProcessingStatus = {
      fileName,
      status: 'uploading',
      progress: 0,
      steps: DEFAULT_PROCESSING_STEPS.map(step => ({ ...step })),
    };

    setFileProcessingStatus(prev => {
      // Check if file already exists
      if (prev.some(file => file.fileName === fileName)) {
        return prev;
      }
      return [...prev, newFileStatus];
    });
  }, []);

  // Remove file from processing queue
  const removeFileFromProcessing = useCallback((fileName: string) => {
    setFileProcessingStatus(prev => prev.filter(file => file.fileName !== fileName));
  }, []);

  // Clear all processing files
  const clearAllProcessing = useCallback(() => {
    setFileProcessingStatus([]);
  }, []);

  // Reset file status
  const resetFileStatus = useCallback((fileName: string) => {
    setFileProcessingStatus(prev => 
      prev.map(file => 
        file.fileName === fileName 
          ? {
              ...file,
              status: 'uploading',
              progress: 0,
              steps: DEFAULT_PROCESSING_STEPS.map(step => ({ ...step })),
              error: undefined
            }
          : file
      )
    );
  }, []);

  // Update file status and progress
  const updateFileStatus = useCallback((
    fileName: string,
    status: FileProcessingStatus['status'],
    progress: number,
    stepId: string,
    stepStatus: ProcessingStep['status'],
    stepProgress?: number
  ) => {
    setFileProcessingStatus(prev => 
      prev.map(file => {
        if (file.fileName === fileName) {
          const updatedSteps = file.steps.map(step => {
            if (step.id === stepId) {
              return {
                ...step,
                status: stepStatus,
                progress: stepProgress !== undefined ? stepProgress : step.progress
              };
            }
            return step;
          });

          return {
            ...file,
            status,
            progress,
            steps: updatedSteps
          };
        }
        return file;
      })
    );
  }, []);

  // Calculate derived state
  const isProcessing = fileProcessingStatus.length > 0 && 
    fileProcessingStatus.some(file => 
      file.status !== 'completed' && file.status !== 'error'
    );

  const totalProgress = fileProcessingStatus.length > 0
    ? Math.round(
        fileProcessingStatus.reduce((acc, file) => acc + file.progress, 0) / 
        fileProcessingStatus.length
      )
    : 0;

  const completedFiles = fileProcessingStatus.filter(file => file.status === 'completed').length;
  const errorFiles = fileProcessingStatus.filter(file => file.status === 'error').length;

  return {
    // State
    fileProcessingStatus,
    isProcessing,
    totalProgress,
    completedFiles,
    errorFiles,
    
    // Actions
    setFileProcessingStatus,
    updateFileStatus,
    addFileToProcessing,
    removeFileFromProcessing,
    clearAllProcessing,
    resetFileStatus,
  };
}
