import { useState } from 'react';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function BrandingControls() {
  const [applyLogo, setApplyLogo] = useState(true);
  const [applyFooter, setApplyFooter] = useState(true);
  const [textSize, setTextSize] = useState(40);

  return (
    <Card title="Branding controls">
      <div className="space-y-3 text-sm">
        <label className="flex items-center justify-between">
          <span>Apply company logo</span>
          <input type="checkbox" checked={applyLogo} onChange={(e) => setApplyLogo(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between">
          <span>Apply company footer</span>
          <input type="checkbox" checked={applyFooter} onChange={(e) => setApplyFooter(e.target.checked)} />
        </label>
        <div>
          <label className="text-sm font-medium text-slate-700">Text size · text_size</label>
          <input type="number" className="input mt-1" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} />
        </div>
        <Button>Apply branding</Button>
      </div>
    </Card>
  );
}
