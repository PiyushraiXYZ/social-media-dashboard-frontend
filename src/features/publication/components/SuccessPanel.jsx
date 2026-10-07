import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { PlatformIcon } from '../../../components/shared/PlatformIcon/PlatformIcon.jsx';
import { Badge } from '../../../components/ui/Badge/Badge.jsx';

export function SuccessPanel({ post, onNavigate }) {
  const platforms = post?.platforms || [];

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card title="Published content snapshot">
          <div className="text-sm font-medium text-slate-800">
            {post?.title || 'Untitled'}
          </div>

          {post?.media_url && (
            <img
              src={post.media_url}
              alt="Published media"
              className="mt-3 w-full rounded-lg border border-slate-200"
            />
          )}

          <p className="mt-3 whitespace-pre-wrap text-xs text-slate-600">
            {post?.content_text}
          </p>
        </Card>
      </div>

      <Card title="Destinations">
        <ul className="space-y-3">
          {platforms.map((p) => (
            <li key={p} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={p} />
                <span className="text-sm capitalize text-slate-800">{p}</span>
              </div>
              <Badge tone="success">Published</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={() => onNavigate('posts')}>
            Return to posts
          </Button>
        </div>
      </Card>
    </div>
  );
}