export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  tenantId: string;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  tenantId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: 'FREE' | 'PRO';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}