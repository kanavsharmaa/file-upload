import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import type { IUserContext } from '../contexts/UserContext';

// 1. Import the viewer components
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';

// 2. We use a public CDN for the worker.
// This is the easiest way to get it working
// without complex build configurations.
const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";


export const PdfViewerPage = () => {
  // 3. Get the fileId from the URL (e.g., /files/12345)
  const { fileId } = useParams();
  
  // 4. Get the current user role from context
  const { currentUser } = useContext(UserContext) as IUserContext;

  // 5. State for our component
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return; // Don't do anything if there's no fileId

    // This is a temporary local URL we create
    let objectUrl: string | null = null;

    const fetchPdf = async () => {
      try {
        // 6. We must fetch the file manually to add our auth header
        const response = await fetch(
          `http://localhost:4000/api/files/${fileId}`,
          {
            headers: {
              'X-User-Role': currentUser, // Required by our 'isUser' middleware
            },
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to load PDF');
        }

        // 7. Get the PDF file as a 'Blob' (raw file data)
        const blob = await response.blob();

        // 8. Create a temporary local URL for the blob
        // (e.g., "blob:http://localhost:5173/abc-123")
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    };

    fetchPdf();

    // 9. IMPORTANT: Cleanup function
    // We must revoke the temporary URL when the component unmounts
    // to prevent memory leaks.
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId, currentUser]); // Re-fetch if the file or user changes


  // 10. Render loading or error states
  if (error) {
    return <div className="error">Error loading PDF: {error}</div>;
  }

  if (!pdfUrl) {
    return <div className="loading">Loading PDF...</div>;
  }

  // 11. Render the viewer
  return (
    <Worker workerUrl={PDF_WORKER_URL}>
      <div className="pdf-viewer-container">
        <Viewer fileUrl={pdfUrl} />
      </div>
    </Worker>
  );
};