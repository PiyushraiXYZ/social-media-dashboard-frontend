import { Button } from '../../../components/ui/Button/Button.jsx';

export function MetaAuthFlow({ onContinue }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-medium text-slate-800">Authorize with Meta</div>
      <p className="mt-1 text-xs text-slate-500">
        SocialDesk requests access to discover Pages and publish supported content to the Page you select.
      </p>
      <Button className="mt-3" onClick={onContinue}>Continue with Meta</Button>
    </div>
  );
}
