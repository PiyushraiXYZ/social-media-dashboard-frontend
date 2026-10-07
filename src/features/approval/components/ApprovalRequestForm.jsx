import { useState } from 'react';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';

export function ApprovalRequestForm() {
  const [email, setEmail] = useState('maya@northstar.example');
  const [note, setNote] = useState('Please confirm the branded image and platform captions before publishing.');

  return (
    <div className="space-y-4">
      <Input label="Confirmation email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Review note — optional</label>
        <textarea className="input" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <Alert tone="info" title="Approval window">
        A waiting post can expire if its approval window is exceeded.
      </Alert>
      <div className="flex gap-2">
        <Button>Request confirmation</Button>
        <Button variant="ghost">Keep as draft</Button>
      </div>
    </div>
  );
}
