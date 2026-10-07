import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { loginSchema } from '../../../lib/validators.js';
import { useLoginMutation } from '../api.js';
import {
  setCredentials,
  persistAuth,
  setAuthError,
} from '../authSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      keepSignedIn: true,
    },
  });

  const redirectTo = location.state?.from?.pathname || PATHS.overview;

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      persistAuth(res, values.keepSignedIn);
      dispatch(setCredentials(res));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err?.data?.detail ||
        err?.error ||
        'Login failed. Please try again.';
      setServerError(message);
      dispatch(setAuthError(message));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Welcome back.
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Sign in to your SocialDesk workspace.
      </p>

      {serverError && (
        <div className="mt-4">
          <Alert tone="danger" title="Sign in failed">
            {serverError}
          </Alert>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-4"
        noValidate
      >
        <Input
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="maya@northstar.example"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            className="rounded border-slate-300"
            {...register('keepSignedIn')}
          />
          Keep me signed in
        </label>

        <Button
          type="submit"
          className="w-full justify-center"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to SocialDesk?{' '}
        <Link
          to={PATHS.register}
          className="text-brand-600 font-medium hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}