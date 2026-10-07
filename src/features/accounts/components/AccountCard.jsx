import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

const tone = (s) => s === 'ready' ? 'success' : s === 'validation_pending' ? 'warning' : 'danger';

export function AccountCard({ account }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100">
            <PlatformIcon platform={account.platform} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800">{account.label}</div>
            <div className="text-xs text-slate-500">{account.handle}</div>
          </div>
        </div>
        <Badge tone={tone(account.status)}>{account.status.replace('_', ' ')}</Badge>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="ghost" size="sm">Manage</Button>
        <Button variant="ghost" size="sm">Disconnect</Button>
      </div>
    </Card>
  );
}
