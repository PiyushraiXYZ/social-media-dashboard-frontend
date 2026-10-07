import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Link } from 'react-router-dom';
import { PATHS } from '../../../routes/routePaths.js';

export function OnboardingChecklist() {
  return (
    <Card title="From a topic to a ready-to-share story." subtitle="Set up in a few steps.">
      <ol className="space-y-4">
        <li className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium text-slate-800">Create your first draft</div>
            <div className="text-xs text-slate-500">Use AI or a manual draft. Approve now or plan ahead.</div>
          </div>
          <Link to={PATHS.createPost} className="btn-primary">Create draft</Link>
        </li>
        <li className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium text-slate-800">Connect an account</div>
            <div className="text-xs text-slate-500">Add a Facebook Page, eligible Instagram account, or LinkedIn member.</div>
          </div>
          <Link to={PATHS.accounts} className="btn-ghost">Connect</Link>
        </li>
        <li className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium text-slate-800">Add your brand</div>
            <div className="text-xs text-slate-500">Upload a company logo and footer to personalize your media.</div>
          </div>
          <Link to={PATHS.brandSettings} className="btn-ghost">Open</Link>
        </li>
      </ol>
    </Card>
  );
}

