import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, Role } from '../../types';
import { setEncrypted, getDecrypted } from '../../utils/crypto';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  role: Role | null;
  userId: number | null;
  isAuthenticated: boolean;
}

const token = getDecrypted('token');
const refreshToken = getDecrypted('refreshToken');
const storedUser = getDecrypted('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  token,
  refreshToken,
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
      const { token, refreshToken, email, role, id } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.email = email;
      state.role = role;
      state.userId = id;
      state.isAuthenticated = true;
      setEncrypted('token', token);
      setEncrypted('refreshToken', refreshToken);
      setEncrypted('user', JSON.stringify({ email, role, userId: id }));
    },
    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      setEncrypted('token', action.payload);
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.email = null;
      state.role = null;
      state.userId = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, updateToken, logout } = authSlice.actions;
export default authSlice.reducer;
