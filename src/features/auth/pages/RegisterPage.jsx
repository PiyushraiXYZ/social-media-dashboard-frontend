import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { registerSchema } from '../../../lib/validators.js';
import { useRegisterMutation } from '../api.js';
import {
  setCredentials,
  persistAuth,
  setAuthError,
} from '../authSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [serverError, setServerError] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      inviteCode: '',
      keepSignedIn: true,
    },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const res = await registerUser({
        email: values.email,
        password: values.password,
        inviteCode: values.inviteCode,
      }).unwrap();

      persistAuth(res, values.keepSignedIn);
      dispatch(setCredentials(res));

      // New users → first-use experience
      navigate(PATHS.firstUse, { replace: true });
    } catch (err) {
      const message =
        err?.data?.detail ||
        err?.error ||
        'Registration failed. Please try again.';
      setServerError(message);
      dispatch(setAuthError(message));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Create your account.
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Set up your SocialDesk workspace in a few seconds.
      </p>

      {serverError && (
        <div className="mt-4">
          <Alert tone="danger" title="Registration failed">
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
          placeholder="you@company.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <div>
          <button
            type="button"
            onClick={() => setShowInvite((v) => !v)}
            className="text-xs font-medium text-brand-600 hover:underline"
          >
            {showInvite ? '− Hide invite code' : '+ I have an invite code'}
          </button>

          {showInvite && (
            <div className="mt-3">
              <Input
                label="Invite code (optional)"
                placeholder="INVITE-XXXX"
                {...register('inviteCode')}
                error={errors.inviteCode?.message}
              />
            </div>
          )}
        </div>

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
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link
          to={PATHS.login}
          className="text-brand-600 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}