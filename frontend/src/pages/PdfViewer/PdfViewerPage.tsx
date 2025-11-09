import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import clsx from 'clsx';
import { useUserContext } from '@contexts/UserContext';
import { AnnotationToolbar } from '@/components/AnnotationToolbar';
import { AnnotationLayer } from '@/components/AnnotationLayer';
import { VisibilitySelector } from '@/components/VisibilitySelector';
import { annotationApi } from '@utils/annotationApi';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import type { Annotation, AnnotationType, Role } from '@/types';
import styles from './PdfViewerPage.module.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker - use new() instead of workerSrc to avoid CORS issues
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export const PdfViewerPage = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const { currentUser } = useUserContext();
  const { toast } = useToast();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentTool, setCurrentTool] = useState<AnnotationType | null>(null);
  const [currentColor, setCurrentColor] = useState<string>('#FFEB3B');
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [visibility, setVisibility] = useState<Role[]>([]);
  const [showVisibilitySelector, setShowVisibilitySelector] = useState<boolean>(false);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  useEffect(() => {
    if (!fileId) return;

    // Clear previous PDF and annotations immediately when fileId changes
    setPdfUrl(null);
    setAnnotations([]);
    setError(null);
    setNumPages(0);
    setPageNumber(1);

    let objectUrl: string | null = null;

    const fetchPdf = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        const response = await fetch(
          `${API_BASE_URL}/files/${fileId}`,
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

  // Fetch annotations (only after PDF is loaded)
  useEffect(() => {
    if (!fileId || !pdfUrl) return;

    const fetchAnnotations = async () => {
      try {
        const data = await annotationApi.getByDocument(fileId, currentUser);
        setAnnotations(data);
      } catch (err) {
        console.error('Failed to fetch annotations:', err);
        setAnnotations([]);
      }
    };

    fetchAnnotations();
  }, [fileId, currentUser, pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const onPageLoadSuccess = (page: any): void => {
    setPageWidth(page.width);
    setPageHeight(page.height);
  };

  const canAnnotate = useMemo(
    () => currentUser === 'A1' || currentUser === 'D1' || currentUser === 'D2',
    [currentUser]
  );

  const handleAnnotationCreate = useCallback(async (annotation: Partial<Annotation>) => {
    if (!fileId || !annotation.type || !annotation.data) return;

    // Create optimistic annotation with temporary ID
    const optimisticAnnotation: Annotation = {
      _id: `temp-${Date.now()}`,
      documentId: fileId,
      createdBy: currentUser,
      type: annotation.type,
      data: annotation.data,
      isPrivate,
      visibility,
      createdAt: new Date().toISOString(),
    };

    // Add to UI immediately (optimistic update)
    setAnnotations((prev) => [...prev, optimisticAnnotation]);

    try {
      // Make API call
      const newAnnotation = await annotationApi.create(
        {
          documentId: fileId,
          type: annotation.type,
          data: annotation.data,
          isPrivate,
          visibility,
        },
        currentUser
      );
      
      // Replace optimistic annotation with real one from server
      setAnnotations((prev) =>
        prev.map((ann) =>
          ann._id === optimisticAnnotation._id ? newAnnotation : ann
        )
      );
    } catch (err) {
      console.error('Failed to create annotation:', err);
      
      // Remove optimistic annotation on failure
      setAnnotations((prev) =>
        prev.filter((ann) => ann._id !== optimisticAnnotation._id)
      );
      
      // Show error to user
      const errorMessage = err instanceof Error ? err.message : 'Failed to create annotation. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  }, [fileId, currentUser, isPrivate, visibility]);

  const handleAnnotationUpdate = useCallback(async (annotationId: string, updates: Partial<Annotation>) => {
    // Store the original annotation in case we need to restore it
    const originalAnnotation = annotations.find((ann) => ann._id === annotationId);
    if (!originalAnnotation) return;

    // Update UI immediately (optimistic update)
    setAnnotations((prev) =>
      prev.map((ann) =>
        ann._id === annotationId ? { ...ann, ...updates } : ann
      )
    );

    try {
      const updatedAnnotation = await annotationApi.update(annotationId, updates, currentUser);
      
      // Replace with server response
      setAnnotations((prev) =>
        prev.map((ann) =>
          ann._id === annotationId ? updatedAnnotation : ann
        )
      );

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Comment updated successfully',
      });
    } catch (err) {
      console.error('Failed to update annotation:', err);
      
      // Restore original annotation on failure
      setAnnotations((prev) =>
        prev.map((ann) =>
          ann._id === annotationId ? originalAnnotation : ann
        )
      );
      
      // Show error to user
      const errorMessage = err instanceof Error ? err.message : 'Failed to update annotation. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  }, [annotations, currentUser, toast]);

  const handleAnnotationDelete = useCallback(async (annotationId: string) => {
    // Store the annotation in case we need to restore it
    const annotationToDelete = annotations.find((ann) => ann._id === annotationId);
    if (!annotationToDelete) return;

    // Remove from UI immediately (optimistic update)
    setAnnotations((prev) => prev.filter((ann) => ann._id !== annotationId));

    try {
      await annotationApi.delete(annotationId, currentUser);
      
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    } catch (err) {
      console.error('Failed to delete annotation:', err);
      
      // Restore annotation on failure
      setAnnotations((prev) => [...prev, annotationToDelete]);
      
      // Show error to user
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete annotation. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  }, [annotations, currentUser, toast]);

  const handleVisibilityChange = useCallback((newIsPrivate: boolean, newVisibility: Role[]) => {
    setIsPrivate(newIsPrivate);
    setVisibility(newVisibility);
  }, []);

  if (error) {
    return <div className={styles.error}>Error loading PDF: {error}</div>;
  }

  if (!pdfUrl) {
    return <div className={styles.loading}>Loading PDF...</div>;
  }

  return (
    <div className={styles.container}>
      <AnnotationToolbar
        currentTool={currentTool}
        onToolSelect={setCurrentTool}
        currentColor={currentColor}
        onColorChange={setCurrentColor}
        canAnnotate={canAnnotate}
      />

      <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-card rounded-lg shadow-sm border">
        <Button
          onClick={() => setPageNumber((prev) => prev - 1)}
          disabled={pageNumber <= 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm font-medium px-4">
          Page {pageNumber} of {numPages}
        </span>
        <Button
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={pageNumber >= numPages}
          variant="outline"
          size="sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
        {canAnnotate && (
          <Dialog open={showVisibilitySelector} onOpenChange={setShowVisibilitySelector}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="ml-4"
              >
                <Settings className="h-4 w-4 mr-2" />
                Visibility Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Annotation Visibility Settings</DialogTitle>
                <DialogDescription>
                  Configure who can see your annotations. Changes apply to new annotations only.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <VisibilitySelector
                  onVisibilityChange={handleVisibilityChange}
                  currentUser={currentUser}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className={styles.documentWrapper}>
        <div className={clsx(styles.pageContainer, {
          [styles.annotating]: currentTool && currentTool !== 'Highlight'
        })}>
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
              onLoadSuccess={onPageLoadSuccess}
            />
          </Document>
          <AnnotationLayer
            annotations={annotations}
            pageNumber={pageNumber}
            currentTool={currentTool}
            currentColor={currentColor}
            currentUser={currentUser}
            onAnnotationCreate={handleAnnotationCreate}
            onAnnotationUpdate={handleAnnotationUpdate}
            onAnnotationDelete={handleAnnotationDelete}
            canAnnotate={canAnnotate}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
          />
        </div>
      </div>
    </div>
  );
};
