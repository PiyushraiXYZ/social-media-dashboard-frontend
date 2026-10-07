import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { AccountCard } from '../components/AccountCard.jsx';
import { PATHS } from '../../../routes/routePaths.js';

export function SocialAccountsPage() {
  const accounts = useSelector((s) => s.accounts.byId);
  const list = Object.values(accounts);
  return (
    <>
      <PageHeader
        eyebrow="02 / Account Connections"
        title="Your publishing destinations."
        subtitle="Manage connected identities and check their readiness before every publish."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {list.map((a) => <AccountCard key={a.id} account={a} />)}
      </div>
      <div className="mt-6">
        <Card title="Connections needing recovery" subtitle="Inactive accounts are excluded from new destination selections.">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Facebook · Northstar Alumni · Expired</span><Button variant="ghost" size="sm">Reconnect</Button></li>
            <li className="flex justify-between"><span>Instagram · @northstar.studio · Missing Page access</span><Button variant="ghost" size="sm">Reconnect</Button></li>
          </ul>
          <div className="mt-3"><Link to={PATHS.accountRecovery} className="text-brand-600 text-sm font-medium">View connection recovery →</Link></div>
        </Card>
      </div>
    </>
  );
}
