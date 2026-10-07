import { Alert } from '../../../components/ui/Alert/Alert.jsx';

export function PastDateAlert() {
  return (
    <Alert tone="warning" title="Past-date validation">
      05 Oct 2026 at 18:30 UTC is in the past. Choose a future date and time to continue.
    </Alert>
  );
}
📁 src/features/publication/
