import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { GenerationStages } from '../components/GenerationStages.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/routePaths.js';

export function GenerationStatusPage() {
  const navigate = useNavigate();
  const gen = useSelector((s) => s.posts.generation);
  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Async generation"
        title="Turning your idea into a post."
        subtitle="Generation is running in the background. Your original inputs are preserved."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Generation activity" subtitle={`Task ${gen.taskId || 'gen_123_oct06'}`}>
            <GenerationStages stages={gen.stages || []} />
            <div className="mt-4 flex gap-2">
              <Button variant="ghost">Back to posts</Button>
              <Button variant="ghost" onClick={() => navigate(PATHS.postEditor(123))}>Check status</Button>
            </div>
          </Card>
        </div>
        <Card title="Preserved request">
          <div className="text-sm text-slate-700">{gen.request?.title || 'AI and Machine Learning'}</div>
          <ul className="mt-3 space-y-1 text-xs text-slate-500">
            <li>Branded image · Platform-specific captions</li>
            <li>Generate image: On</li>
            <li>Brand assets: Northstar logo + footer</li>
          </ul>
        </Card>
      </div>
    </>
  );
}
