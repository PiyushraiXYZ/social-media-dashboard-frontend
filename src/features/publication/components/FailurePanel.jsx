import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function FailurePanel({ post, onNavigate }) {
  const platforms = post?.platforms || [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {platforms.map((p) => (
        <Card key={p}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold capitalize">{p}</div>
            <Badge tone="danger">Failed</Badge>
          </div>
          <p className="mt-2 text-xs text-slate-600">
            {post?.rejection_reason ||
              'Publishing was not successful. Please check platform permissions and retry.'}
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('posts')}>
              Back to posts
            </Button>
            <Button size="sm" onClick={() => onNavigate('retry')}>
              Retry
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}