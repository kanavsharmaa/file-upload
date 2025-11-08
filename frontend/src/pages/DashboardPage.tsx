import { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { IUserContext, Role } from '../contexts/UserContext';
import { FileUploader } from '../components/FileUploader';
import { FileListPage } from '../components/FileListPage';
import { apiFetch } from '../utils/api';

// This type remains the same
export type ApiFile = {
  _id: string;
  fileName: string;
  uploaderRole: string;
  uploadDate: string;
};

export const DashboardPage = () => {
  const { currentUser } = useContext(UserContext) as IUserContext;

  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async (role: Role) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch('/files', role);
      setFiles(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(currentUser);
  }, [currentUser, fetchFiles]);

  const handleUploadSuccess = () => {
    fetchFiles(currentUser);
  };

  // 1. NEW: Add the delete handler
  const handleDelete = async (fileId: string) => {
    // Add a simple confirmation
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      // 2. Call the DELETE endpoint
      await apiFetch(`/files/${fileId}`, currentUser, {
        method: 'DELETE',
      });
      // 3. Refresh the file list on success
      fetchFiles(currentUser);
    } catch (err) {
      if (err instanceof Error) {
        alert(`Delete failed: ${err.message}`);
      } else {
        alert('An unknown error occurred during deletion.');
      }
    }
  };

  return (
    <div>
      {currentUser === 'A1' && (
        <>
          <FileUploader onUploadSuccess={handleUploadSuccess} />
          <hr style={{ margin: '2rem 0' }} />
        </>
      )}

      {/* 4. Pass down 'currentUser' and 'onDelete' handler */}
      <FileListPage
        files={files}
        isLoading={isLoading}
        error={error}
        currentUser={currentUser}
        onDelete={handleDelete}
      />
    </div>
  );
};