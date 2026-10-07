import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { PATHS } from '../../../routes/routePaths.js';
import { useAuth } from '../../../hooks/useAuth.js';

export function ConfirmEmailPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Mail />
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">Check your inbox.</h1>
      <p className="mt-1 text-sm text-slate-500">
        We sent a confirmation email to <span className="font-medium text-slate-700">{user?.email}</span>.
        Open the link to confirm your address.
      </p>

      <Alert tone="info" title="Awaiting email confirmation" className="mt-6">
        Email confirmation helps keep your workspace and approval notifications connected to the right person.
      </Alert>

      <div className="mt-4 flex flex-col gap-2">
        <Button variant="ghost">Resend confirmation email</Button>
        <Button variant="ghost">Change email</Button>
      </div>

      <div className="mt-8 space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <div className="font-medium text-slate-900">Confirmed — success state</div>
        <p className="text-slate-500">Your email is confirmed. You can now continue into your workspace.</p>
        <Button className="w-full justify-center" onClick={() => navigate(PATHS.overview)}>
          Continue to workspace
        </Button>
      </div>
    </div>
  );
}
