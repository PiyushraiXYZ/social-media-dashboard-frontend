import { MediaPreview } from '../../../components/shared/MediaPreview/MediaPreview.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function MediaPanel() {
  return (
    <div>
      <MediaPreview
        src="https://via.placeholder.com/800x500/0f172a/ffffff?text=Build.+Learn.+Grow."
        footer="NORTHSTAR LEARNING · Ideas into impact · northstar.example"
      />
      <div className="mt-3 flex gap-2">
        <Button variant="ghost" size="sm">Replace media</Button>
        <Button variant="ghost" size="sm">Open branding editor</Button>
      </div>
    </div>
  );
}
