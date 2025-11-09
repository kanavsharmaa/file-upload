import { useState } from 'react';
import { useUserContext } from '@contexts/UserContext';
import { apiFetch } from '@utils/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, File } from 'lucide-react';
import type { UploadStatus } from '@/types';

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

interface UploadResponse {
  message: string;
}

export const FileUploader = ({ onUploadSuccess }: FileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<UploadStatus>('idle');

  const { currentUser } = useUserContext();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(Array.from(event.target.files));
      setStatus('idle');
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (selectedFiles.length === 0) return;

    setStatus('uploading');

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
      setSelectedFiles([]);
      toast({
        variant: 'success',
        title: 'Success',
        description: response.message,
      });
      onUploadSuccess();
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during upload.';
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessage,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          Upload PDF Document{selectedFiles.length > 1 ? 's' : ''}
        </CardTitle>
        <CardDescription>
          Select one or more PDF files to upload to the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <File className="h-10 w-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF files only</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Select PDF file(s)"
              multiple
            />
          </label>
          
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <File className="h-4 w-4" />
              <span>
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </span>
            </div>
          )}
          
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || status === 'uploading'}
            className="w-full"
            size="lg"
          >
            {status === 'uploading' ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length > 0 ? selectedFiles.length : ''} File{selectedFiles.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
