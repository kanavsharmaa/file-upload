import { Link } from 'react-router-dom';
import type { ApiFile, Role } from '@/types';
import styles from './FileList.module.css';

interface FileListProps {
  files: ApiFile[];
  isLoading: boolean;
  error: string | null;
  currentUser: Role;
  onDelete: (fileId: string) => void | Promise<void>;
}

export const FileList = ({
  files,
  isLoading,
  error,
  currentUser,
  onDelete,
}: FileListProps) => {
  if (isLoading) {
    return <div className={styles.loading}>Loading files...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Documents</h2>
      {files.length === 0 ? (
        <p className={styles.emptyState}>No files have been uploaded yet.</p>
      ) : (
        <ul className={styles.list}>
          {files.map((file) => (
            <li key={file._id} className={styles.listItem}>
              <div>
                <Link to={`/files/${file._id}`} className={styles.link}>
                  {file.fileName}
                </Link>
              </div>

              <div className={styles.actions}>
                <span className={styles.meta}>
                  Uploaded by: {file.uploaderRole} on{' '}
                  {new Date(file.uploadDate).toLocaleDateString()}
                </span>

                {currentUser === 'A1' && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(file._id)}
                    aria-label={`Delete ${file.fileName}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
