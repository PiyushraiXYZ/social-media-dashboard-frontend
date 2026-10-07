import { Card } from '../../../components/ui/Card/Card.jsx';
import { BrandPreview as SharedPreview } from '../../../components/shared/BrandPreview/BrandPreview.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function BrandPreview() {
  return (
    <Card title="Brand preview" subtitle="Example effects on the final image">
      <SharedPreview
        src="https://via.placeholder.com/800x500/0f172a/ffffff?text=AI+network"
        text="Build. Learn. Grow."
        position="top-center"
        footer="NORTHSTAR LEARNING · Ideas into impact · northstar.example"
      />
      <div className="mt-3 flex gap-2">
        <Button variant="ghost" size="sm">Logo applied</Button>
        <Button variant="ghost" size="sm">Footer applied</Button>
      </div>
    </Card>
  );
}
