import { useSelector, useDispatch } from 'react-redux';
import {
  selectAuth,
  logout,
  setCredentials,
} from '../features/auth/authSlice.js';

export function useAuth() {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  return {
    ...auth,
    isAuthenticated: Boolean(auth.token),
    // Called after successful login/register with backend response
    login: (backendResponse) => dispatch(setCredentials(backendResponse)),
    logout: () => dispatch(logout()),
  };
}