import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetMeQuery } from '../features/auth/api.js';
import {
  setUser,
  setAuthLoading,
  logout,
} from '../features/auth/authSlice.js';

/**
 * On app boot, if a token exists, validate it by calling `/auth/me`.
 * If invalid → force logout.
 */
export function useBootstrapAuth() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const ran = useRef(false);

  const [triggerGetMe] = useLazyGetMeQuery();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (!token) return;

    dispatch(setAuthLoading(true));

    triggerGetMe()
      .unwrap()
      .then((me) => {
        if (me) {
          dispatch(
            setUser({
              id: me.id,
              email: me.email,
              role: me.role,
              admin_id: me.admin_id ?? null,
            })
          );
        }
      })
      .catch(() => {
        // Invalid/expired token → wipe
        dispatch(logout());
      })
      .finally(() => {
        dispatch(setAuthLoading(false));
      });
  }, [dispatch, token, triggerGetMe]);
}