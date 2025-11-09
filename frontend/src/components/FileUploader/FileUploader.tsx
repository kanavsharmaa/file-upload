import { useState } from 'react';
import { useUserContext } from '@contexts/UserContext';
import { apiFetch } from '@utils/api';
import type { UploadStatus } from '@/types';
import clsx from 'clsx';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

interface UploadResponse {
  message: string;
}

export const FileUploader = ({ onUploadSuccess }: FileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');

  const { currentUser } = useUserContext();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (selectedFiles.length === 0) return;

    setStatus('uploading');
    setMessage(`Uploading ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}...`);

    const formData = new FormData();
    
    // Use bulk endpoint for multiple files, single endpoint for one file
    const isBulkUpload = selectedFiles.length > 1;
    
    if (isBulkUpload) {
      selectedFiles.forEach(file => {
        formData.append('pdfFiles', file);
      });
    } else {
      formData.append('pdfFile', selectedFiles[0]);
    }

    try {
      const response = await apiFetch<UploadResponse>(
        isBulkUpload ? '/files/upload-bulk' : '/files/upload',
        currentUser,
        {
          method: 'POST',
          body: formData,
        }
      );

      setStatus('success');
      setMessage(response.message);
      setSelectedFiles([]);
      onUploadSuccess();
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error ? err.message : 'An unknown error occurred during upload.'
      );
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload PDF Document{selectedFiles.length > 1 ? 's' : ''}</h2>
      <div className={styles.form}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className={styles.fileInput}
          aria-label="Select PDF file(s)"
          multiple
        />
        {selectedFiles.length > 0 && (
          <p className={styles.fileCount}>
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </p>
        )}
        <button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || status === 'uploading'}
          className={styles.button}
        >
          {status === 'uploading' ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} File${selectedFiles.length > 1 ? 's' : ''}`}
        </button>

        {message && (
          <div className={clsx(styles.status, styles[status])}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
