import { Link } from 'react-router-dom';
import type { ApiFile } from '../pages/DashboardPage';
import type { Role } from '../contexts/UserContext';

// 1. Export the interface so the parent component (DashboardPage) can 
//    correctly validate the props it passes.
export interface FileListPageProps {
  files: ApiFile[];
  isLoading: boolean;
  error: string | null;
  // This property is used to determine access control for the delete button.
  currentUser: Role;
  // This prop allows for an async function (which returns a Promise)
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
                {/* Link to the PDF viewer page */}
                <Link to={`/files/${file._id}`}>
                  {file.fileName}
                </Link>
              </div>

              <div className="file-list-item-actions">
                <span className="file-meta">
                  Uploaded by: {file.uploaderRole} on {new Date(file.uploadDate).toLocaleDateString()}
                </span>
                
                {/* The delete button is only visible if the user is A1 (Admin) */}
                {currentUser === 'A1' && (
                  <button
                    className="delete-button"
                    // The onDelete callback is triggered here, passing the file's ID back to the parent.
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