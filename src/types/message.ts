export interface Message {
  _id: string;
  sender: {
    _id: string;
    email: string;
  };
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  replyTo?: string | null;
  replies?: Message[];
  isBroadcast?: boolean;
}