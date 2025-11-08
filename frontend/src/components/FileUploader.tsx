import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { IUserContext } from '../contexts/UserContext';
import { apiFetch } from '../utils/api';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// 1. Define the props interface
interface FileUploaderProps {
  onUploadSuccess: () => void; // The new prop we're adding
}

export const FileUploader = ({ onUploadSuccess }: FileUploaderProps) => {
  // State for the selected file and upload status
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [message, setMessage] = useState('');

  // Get the current user from context
  const { currentUser } = useContext(UserContext) as IUserContext;

  // Store the selected file in state when the user chooses one
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  // Handle the file upload on button click
  const handleUpload = async () => {
    if (!selectedFile) return;

    // Set loading state
    setStatus('uploading');
    setMessage('Uploading...');

    // We use FormData to send files
    const formData = new FormData();
    // The key "pdfFile" MUST match the backend:
    // upload.single('pdfFile')
    formData.append('pdfFile', selectedFile);

    try {
      // Use our apiFetch helper to make the POST request
      const response = await apiFetch('/files/upload', currentUser, {
        method: 'POST',
        body: formData,
      });

      setStatus('success');
      setMessage(response.message);
      setSelectedFile(null); // Clear the file input

      // 2. THIS IS THE FIX:
      // Call the function passed from DashboardPage
      // to trigger a refetch of the file list.
      onUploadSuccess();

    } catch (err) {
      setStatus('error');
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage('An unknown error occurred during upload.');
      }
    }
  };

  return (
    <div className="uploader-container">
      <h2>Upload PDF Document</h2>
      <div className="uploader-form">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || status === 'uploading'}
        >
          {status === 'uploading' ? 'Uploading...' : 'Upload File'}
        </button>

        {/* Show status messages */}
        {message && (
          <div className={`upload-status ${status}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};