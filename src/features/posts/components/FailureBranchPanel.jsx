import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';

export function FailureBranchPanel({ stage = 'content', onRetry }) {
  const map = {
    content: { title: 'Content-generation failure', code: 'CONTENT_SERVICE_ERROR', desc: 'The content service could not produce a caption.' },
    image: { title: 'Image-generation failure', code: 'IMAGE_SERVICE_ERROR', desc: 'Your caption is ready, but the visual could not be generated.' },
    branding: { title: 'Branding-processing failure', code: 'BRANDING_PROCESS_ERROR', desc: 'The original image is preserved.' },
  };
  const info = map[stage];
  return (
    <Card>
      <Alert tone="danger" title={info.title}>{info.desc}</Alert>
      <div className="mt-3 text-xs text-slate-500">Code: {info.code}</div>
      <div className="mt-3 flex gap-2">
        <Button onClick={onRetry}>Retry</Button>
        <Button variant="ghost">Save preserved draft</Button>
      </div>
    </Card>
  );
}
