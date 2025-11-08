import { Link } from 'react-router-dom';
// The 'ApiFile' type comes from the parent (DashboardPage)
import type { ApiFile } from '../pages/DashboardPage';
// The 'Role' type comes from the context file
import type { Role } from '../contexts/UserContext';

// 1. Define the complete and correct props interface
interface FileListPageProps {
  files: ApiFile[];
  isLoading: boolean;
  error: string | null;
  // This was the missing property causing the error:
  currentUser: Role;
  // This allows the function to be asynchronous (return a Promise<void>)
  onDelete: (fileId: string) => void | Promise<void>; 
}

export const FileListPage = ({
  files,
  isLoading,
  error,
  currentUser,
  onDelete,
}: FileListPageProps) => {

  if (isLoading) {
    return <div className="loading">Loading files...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="file-list-container">
      <h2>Available Documents</h2>
      {files.length === 0 ? (
        <p>No files have been uploaded yet.</p>
      ) : (
        <ul className="file-list">
          {files.map((file) => (
            <li key={file._id} className="file-list-item">
              <div>
                <Link to={`/files/${file._id}`}>
                  {file.fileName}
                </Link>
              </div>

              <div className="file-list-item-actions">
                <span className="file-meta">
                  Uploaded by: {file.uploaderRole} on {new Date(file.uploadDate).toLocaleDateString()}
                </span>
                
                {/* Only show the delete button if user is Admin (A1) */}
                {currentUser === 'A1' && (
                  <button
                    className="delete-button"
                    onClick={() => onDelete(file._id)}
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