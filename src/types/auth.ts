export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  pin?: string;
}

export interface LoginFormData {
  username: string;
  password: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  username: string;
  password: string;
  pin: string;
}