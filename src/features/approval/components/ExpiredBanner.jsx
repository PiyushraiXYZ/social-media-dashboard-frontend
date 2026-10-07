import { Alert } from '../../../components/ui/Alert/Alert.jsx';

export function ExpiredBanner() {
  return (
    <Alert tone="warning" title="The approval window has ended">
      This post was not published. Review the preserved content and submit a new confirmation request before planning publication.
    </Alert>
  );
}

