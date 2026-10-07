import { Alert } from '../../ui/Alert/Alert.jsx';
import { Button } from '../../ui/Button/Button.jsx';

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <Alert tone="danger" title={title}>
      <p className="text-sm">{description}</p>
      {onRetry && <div className="mt-3"><Button variant="danger" size="sm" onClick={onRetry}>Retry</Button></div>}
    </Alert>
  );
}
