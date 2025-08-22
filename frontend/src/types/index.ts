export interface User{
    id: string;
    name: string;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
};

export interface IMessage{
  _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image: string;
    isSeen : boolean;
    createdAt: Date;
}