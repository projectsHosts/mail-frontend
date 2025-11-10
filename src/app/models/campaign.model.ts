export interface Campaign {
  id: number;
  name: string;
  subject: string;
  body: string;
  delaySeconds: number;
  createdAt: string;
  recipients: Recipient[];
}

export interface Recipient {
  id: number;
  email: string;
  name: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  errorMessage?: string;
  sentAt?: string;
}

export interface UploadRequest {
  file: File;
  name: string;
  subject: string;
  body: string;
  delaySeconds: number;
}