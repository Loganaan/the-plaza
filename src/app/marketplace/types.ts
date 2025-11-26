export interface User {
  id: number;
  name: string | null;
  email: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  sender: User;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  messages: Message[];
  buyer: User;
  seller: User;
}

export interface Category {
  id: number;
  field: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: string;
  dateListed: string;
  category: Category | null;
}

export interface ListingDetail {
  id: number;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: string;
  dateListed: string;
  category: Category | null;
  seller: User;
  conversations: Conversation[];
}
