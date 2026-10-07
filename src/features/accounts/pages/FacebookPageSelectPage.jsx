import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PATHS } from '../../../routes/routePaths.js';
import { PageSelector } from '../components/PageSelector.jsx';

const pages = [
  { id: 'northstar_learning', name: 'Northstar Learning', handle: 'fb_page_northstar', status: 'Ready', linkedInstagram: true },
  { id: 'northstar_alumni', name: 'Northstar Alumni', handle: 'fb_page_alumni', status: 'Ready', linkedInstagram: false },
  { id: 'northstar_community', name: 'Northstar Community', handle: 'fb_page_community', status: 'Permission denied' },
];

export function FacebookPageSelectPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        eyebrow="02 / Account Connections · Meta"
        title="Choose a Facebook Page."
        subtitle="Connect through Meta, then select the Page SocialDesk should publish to."
      />
      <div className="mb-4 text-xs text-slate-500">1 · Authorize with Meta → 2 · Select Page → 3 · Confirm connection</div>
      <Card title="Available Pages" subtitle="Illustrative discovery results from your Meta authorization.">
        <PageSelector pages={pages} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button onClick={() => navigate(PATHS.instagramSelect)}>Connect selected Page</Button>
        </div>
      </Card>
    </>
  );
}
