import { Button } from '../../../components/ui/Button/Button.jsx';

export function ApprovalActions({ onApprove, onReturn }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">Ready to approve this version?</p>
      <ul className="text-xs text-slate-500">
        <li>Facebook · Northstar Learning · Selected</li>
        <li>Instagram · @northstar.learning · Selected</li>
      </ul>
      <div className="flex flex-col gap-2">
        <Button onClick={onApprove}>Approve post</Button>
        <Button variant="ghost" onClick={onReturn}>Return to editor</Button>
        <Button variant="ghost">Request changes</Button>
      </div>
    </div>
  );
}
