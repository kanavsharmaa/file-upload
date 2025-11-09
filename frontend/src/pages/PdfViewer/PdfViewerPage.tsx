import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { useUserContext } from '@contexts/UserContext';
import styles from './PdfViewerPage.module.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewerPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { currentUser } = useUserContext();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    if (!fileId) return;

    let objectUrl: string | null = null;

    const fetchPdf = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/files/${fileId}`,
          {
            headers: {
              'X-User-Role': currentUser,
            },
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to load PDF');
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred.'
        );
      }
    };

    fetchPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileId, currentUser]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number): void => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = (): void => {
    changePage(-1);
  };

  const nextPage = (): void => {
    changePage(1);
  };

  if (error) {
    return <div className={styles.error}>Error loading PDF: {error}</div>;
  }

  if (!pdfUrl) {
    return <div className={styles.loading}>Loading PDF...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className={styles.button}
        >
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className={styles.button}
        >
          Next
        </button>
      </div>

      <div className={styles.documentWrapper}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className={styles.loading}>Loading document...</div>}
          error={<div className={styles.error}>Failed to load PDF</div>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className={styles.page}
          />
        </Document>
      </div>
    </div>
  );
};
