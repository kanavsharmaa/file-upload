import { useState, useEffect, useCallback } from 'react';
import { useUserContext } from '@contexts/UserContext';
import { FileUploader } from '@components/FileUploader';
import { FileList } from '@components/FileList';
import { apiFetch } from '@utils/api';
import type { ApiFile } from '@/types';
import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const { currentUser } = useUserContext();

  const [files, setFiles] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiFetch<ApiFile[]>('/files', currentUser);
      setFiles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUploadSuccess = (): void => {
    fetchFiles();
  };

  const handleDelete = async (fileId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await apiFetch(`/files/${fileId}`, currentUser, {
        method: 'DELETE',
      });
      fetchFiles();
    } catch (err) {
      alert(
        `Delete failed: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
    }
  };

  return (
    <div className={styles.container}>
      {currentUser === 'A1' && (
        <>
          <FileUploader onUploadSuccess={handleUploadSuccess} />
          <hr className="divider" />
        </>
      )}

      <FileList
        files={files}
        isLoading={isLoading}
        error={error}
        currentUser={currentUser}
        onDelete={handleDelete}
      />
    </div>
  );
};
