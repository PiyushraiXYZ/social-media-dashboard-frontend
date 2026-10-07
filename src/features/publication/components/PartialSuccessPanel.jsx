import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function PartialSuccessPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Successful destinations" className="lg:col-span-2">
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span>Facebook · Northstar Learning</span><Badge tone="success">Published</Badge></li>
          <li className="flex justify-between"><span>Instagram · @northstar.learning</span><Badge tone="success">Published</Badge></li>
        </ul>
      </Card>
      <Card title="Failed destination">
        <div className="flex items-center justify-between">
          <span className="text-sm">LinkedIn · Maya Chen</span>
          <Badge tone="danger">Failed</Badge>
        </div>
        <p className="mt-2 text-xs text-slate-500">PERMISSION_VALIDATION_REQUIRED · LinkedIn integration in progress.</p>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="ghost">Review permissions</Button>
          <Button>Retry LinkedIn only</Button>
        </div>
      </Card>
    </div>
  );
}
