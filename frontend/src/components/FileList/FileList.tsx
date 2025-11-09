import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Trash2, Calendar, User } from 'lucide-react';
import type { ApiFile, Role } from '@/types';

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
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <FileText className="h-5 w-5 mr-2 animate-pulse" />
            Loading files...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8 text-destructive">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Available Documents
        </CardTitle>
        <CardDescription>
          Browse and manage uploaded PDF documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No files have been uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <Card key={file._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/files/${file._id}`} 
                        className="text-lg font-semibold hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-primary" />
                        <span className="truncate">{file.fileName}</span>
                      </Link>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Uploaded by:</span>
                          <Badge variant="secondary" className="ml-1">
                            {file.uploaderRole}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {currentUser === 'A1' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(file._id)}
                        aria-label={`Delete ${file.fileName}`}
                        className="ml-4 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
