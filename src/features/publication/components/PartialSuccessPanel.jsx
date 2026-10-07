import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function PartialSuccessPanel({ post, onNavigate }) {
  const platforms = post?.platforms || [];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card title="Successful destinations" className="lg:col-span-2">
        <ul className="space-y-2 text-sm">
          {platforms.map((p) => (
            <li key={p} className="flex justify-between">
              <span className="capitalize">{p}</span>
              <Badge tone="success">Published</Badge>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Needs attention">
        <div className="flex items-center justify-between">
          <span className="text-sm">Some destinations failed</span>
          <Badge tone="danger">Failed</Badge>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {post?.rejection_reason || 'Check details before retrying.'}
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="ghost" onClick={() => onNavigate('posts')}>
            Back to posts
          </Button>
        </div>
      </Card>
    </div>
  );
}