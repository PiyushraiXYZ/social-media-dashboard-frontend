import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function FailurePanel() {
  const items = [
    { name: 'Facebook', err: 'EXTERNAL_API_ERROR', msg: 'The platform rejected this publishing request.' },
    { name: 'Instagram', err: 'MEDIA_CONTAINER_TIMEOUT', msg: 'The media container did not become ready.' },
    { name: 'LinkedIn', err: 'RATE_LIMIT', msg: 'The platform temporarily limited requests.' },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((i) => (
        <Card key={i.name}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{i.name}</div>
            <Badge tone="danger">Failed</Badge>
          </div>
          <div className="mt-2 text-xs text-slate-500">{i.err}</div>
          <p className="mt-2 text-sm text-slate-600">{i.msg}</p>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm">Review</Button>
            <Button size="sm">Retry</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
