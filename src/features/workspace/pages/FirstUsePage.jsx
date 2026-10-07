import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { OnboardingChecklist } from '../components/OnboardingChecklist.jsx';
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PATHS } from '../../../routes/routePaths.js';
import { useNavigate } from 'react-router-dom';

export function FirstUsePage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="01 / Workspace Overview · First use"
        title="Your next great post starts here."
        subtitle="Set up Northstar Learning's publishing workspace in a few thoughtful steps."
      />
      <EmptyState
        title="No connected accounts yet"
        description="You can create a draft now. Connect an eligible account before requesting publication."
        action={<Button onClick={() => navigate(PATHS.createPost)}>Create your first draft</Button>}
      />
      <div className="mt-6"><OnboardingChecklist /></div>
    </>
  );
}
