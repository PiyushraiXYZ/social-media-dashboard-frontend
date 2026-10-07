import { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { FileUpload } from '../../../components/ui/FileUpload/FileUpload.jsx';
import { BrandPreview } from '../../../components/shared/BrandPreview/BrandPreview.jsx';

export function BrandingEditorPage() {
  const [text, setText] = useState('Build. Learn. Grow.');
  const [position, setPosition] = useState('top-center');
  const [size, setSize] = useState(40);

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Image branding"
        title="Make it unmistakably yours."
        subtitle="Post 123 · Customize the logo, footer, and text layer on your final media."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Final media" subtitle="Layered preview · Custom text, logo, and footer">
            <BrandPreview
              src="https://via.placeholder.com/800x500/0f172a/ffffff?text=AI+network"
              text={text}
              position={position}
              footer="NORTHSTAR LEARNING · Ideas into impact · northstar.example"
            />
            <div className="mt-4 flex gap-2">
              <Button variant="ghost">Reset changes</Button>
              <Button variant="ghost">Back to editor</Button>
            </div>
          </Card>
          <div className="mt-4">
            <Card title="Media layers">
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between"><span>Custom text · {text}</span><span className="text-slate-500">{position} · {size} px</span></li>
                <li className="flex justify-between"><span>Logo · northstar-logo.svg</span><span className="text-slate-500">Applied</span></li>
                <li className="flex justify-between"><span>Footer · northstar-footer.png</span><span className="text-slate-500">Applied</span></li>
              </ul>
            </Card>
          </div>
        </div>
        <div className="space-y-4">
          <Card title="Branding controls">
            <FileUpload label="Upload logo" onFile={() => {}} />
            <div className="mt-3"><FileUpload label="Upload footer" onFile={() => {}} /></div>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Custom text</label>
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} />
              <label className="block text-sm font-medium text-slate-700">Text position</label>
              <select className="input" value={position} onChange={(e) => setPosition(e.target.value)}>
                {['top-left','top-center','top-right','center-left','center','center-right','bottom-left','bottom-center','bottom-right'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <label className="block text-sm font-medium text-slate-700">Text size · text_size</label>
              <input type="number" className="input" value={size} onChange={(e) => setSize(Number(e.target.value))} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button>Apply branding</Button>
              <Button variant="ghost">Save draft</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
