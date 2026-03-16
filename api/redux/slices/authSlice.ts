import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  photo?: string | null;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  expiresAt: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isHydrated = true;
      state.expiresAt = Date.now() + 3 * 24 * 60 * 60 * 1000; // 3 days from now
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authState', JSON.stringify({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          expiresAt: state.expiresAt
        }));
      }
    },
    initialize: (state) => {
      state.isHydrated = true;
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('authState');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          // Check if session has expired
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            localStorage.removeItem('authState');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.expiresAt = null;
          } else {
            state.user = parsed.user;
            state.token = parsed.token;
            state.isAuthenticated = parsed.isAuthenticated;
            state.expiresAt = parsed.expiresAt;
          }
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
      }
    },
  },
});

export const { setCredentials, logout, initialize } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsHydrated = (state: { auth: AuthState }) => state.auth.isHydrated;
