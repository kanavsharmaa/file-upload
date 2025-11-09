export type Role = 'A1' | 'D1' | 'D2' | 'R1';

export interface ApiFile {
  _id: string;
  fileName: string;
  uploaderRole: string;
  uploadDate: string;
}

export interface IUserContext {
  currentUser: Role;
  setCurrentUser: (role: Role) => void;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
