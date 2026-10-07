import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { ApprovalPreview } from '../../approval/components/ApprovalPreview.jsx';

export function SuccessPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2"><Card title="Published content snapshot"><ApprovalPreview /></Card></div>
      <Card title="Destinations">
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between"><span>Facebook · Northstar Learning</span><span className="text-emerald-600">Published 10:15 UTC</span></li>
          <li className="flex justify-between"><span>Instagram · @northstar.learning</span><span className="text-emerald-600">Published 10:16 UTC</span></li>
        </ul>
        <div className="mt-4 flex flex-col gap-2">
          <Button>Return to posts</Button>
          <Button variant="ghost">Activity detail</Button>
        </div>
      </Card>
    </div>
  );
}
