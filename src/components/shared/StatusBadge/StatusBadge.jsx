import { Badge } from '../../ui/Badge/Badge.jsx';
import { statusTone } from '../../../utils/statusMappings.js';

export function StatusBadge({ status }) {
  return <Badge tone={statusTone(status)}>{status}</Badge>;
}
