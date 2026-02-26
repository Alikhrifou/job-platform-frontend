import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, Role } from '../../types';

interface AuthState {
  token: string | null;
  email: string | null;
  role: Role | null;
  userId: number | null;
  isAuthenticated: boolean;
}

const token = localStorage.getItem('token');
const stored = localStorage.getItem('user');
const user = stored ? JSON.parse(stored) : null;

const initialState: AuthState = {
  token,
  email: user?.email ?? null,
  role: user?.role ?? null,
  userId: user?.userId ?? null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      const { token, email, role, userId } = action.payload;
      state.token = token;
      state.email = email;
      state.role = role;
      state.userId = userId;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email, role, userId }));
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
