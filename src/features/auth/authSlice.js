import { createSlice } from '@reduxjs/toolkit';

const TOKEN_KEY = 'socialdesk_token';
const USER_KEY = 'socialdesk_user';

function loadToken() {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY) ||
    null
  );
}

function loadUser() {
  try {
    const raw =
      localStorage.getItem(USER_KEY) ||
      sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function deriveName(email = '') {
  if (!email) return 'User';
  const prefix = email.split('@')[0];
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

const initialState = {
  token: loadToken(),
  user: loadUser(),
  status: 'idle', // idle | loading | authenticated | error
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { access_token, user_id, email, role, admin_id } =
        action.payload;

      const user = {
        id: user_id,
        email,
        role: role || 'user',
        admin_id: admin_id ?? null,
        name: deriveName(email),
      };

      state.token = access_token;
      state.user = user;
      state.status = 'authenticated';
      state.error = null;
    },

    setUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },

    setAuthLoading(state, action) {
      state.status = action.payload ? 'loading' : state.status;
    },

    setAuthError(state, action) {
      state.error = action.payload;
      state.status = 'error';
    },

    clearAuthError(state) {
      state.error = null;
      if (state.status === 'error') state.status = 'idle';
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    },
  },
});

export const {
  setCredentials,
  setUser,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  logout,
} = slice.actions;

export const selectAuth = (s) => s.auth;
export const selectIsAuthenticated = (s) => Boolean(s.auth.token);
export const selectUser = (s) => s.auth.user;

/**
 * Persist auth to localStorage or sessionStorage depending on `remember`.
 * Called right after successful login/register.
 */
export function persistAuth({ access_token, user_id, email, role, admin_id }, remember) {
  const user = {
    id: user_id,
    email,
    role: role || 'user',
    admin_id: admin_id ?? null,
    name: deriveName(email),
  };

  const storage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);

  storage.setItem(TOKEN_KEY, access_token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export default slice.reducer;