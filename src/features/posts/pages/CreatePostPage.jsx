import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { TopicForm } from '../components/TopicForm.jsx';
import { DestinationSelector } from '../../../components/shared/DestinationSelector/DestinationSelector.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneration } from '../postsSlice.js';
import { PATHS } from '../../../routes/routePaths.js';

export function CreatePostPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accounts = Object.values(useSelector((s) => s.accounts.byId));
  const selected = ['facebook', 'instagram'];

  const onGenerate = (values) => {
    dispatch(setGeneration({
      status: 'generating',
      taskId: `gen_${Date.now()}_oct06`,
      stages: [
        { label: 'Content generation', state: 'running' },
        { label: 'Image generation', state: 'queued' },
        { label: 'Branding processing', state: 'queued' },
      ],
      request: values,
    }));
    navigate(PATHS.generation(123));
  };

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation"
        title="What do you want to share?"
        subtitle="Begin with a topic. Shape the content for each destination before you publish."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Post details">
            <TopicForm onGenerate={onGenerate} />
          </Card>
        </div>
        <div>
          <Card title="Publishing destinations" subtitle="Select one or multiple eligible connected accounts.">
            <DestinationSelector accounts={accounts} selected={selected} onChange={() => {}} />
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="flex-1">Save draft</Button>
              <Button variant="ghost" className="flex-1">Schedule</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
