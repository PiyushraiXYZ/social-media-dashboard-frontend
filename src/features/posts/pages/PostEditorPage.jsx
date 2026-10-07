import { useState } from 'react';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import { CaptionEditor } from '../components/CaptionEditor.jsx';
import { MediaPanel } from '../components/MediaPanel.jsx';
import { FormatChecks } from '../components/FormatChecks.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../routes/routePaths.js';

export function PostEditorPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('instagram');
  const [caption, setCaption] = useState(
    'AI is changing how we work. Machine learning is helping us turn complex data into practical decisions. Start small, stay curious, and build with purpose.\n\nBuild. Learn. Grow.\n#ArtificialIntelligence #MachineLearning #NorthstarLearning'
  );

  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Generated → Draft"
        title="Give your idea its final shape."
        subtitle="AI and Machine Learning · Post 123 · Edit each destination's caption before review."
        actions={
          <Button onClick={() => navigate(PATHS.branding(123))}>Open branding editor</Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Content editor">
            <Tabs
              active={tab}
              onChange={setTab}
              tabs={[
                { value: 'instagram', label: 'Instagram' },
                { value: 'facebook', label: 'Facebook' },
                { value: 'linkedin', label: 'LinkedIn' },
              ]}
            />
            <div className="mt-4">
              <CaptionEditor value={caption} onChange={setCaption} platform={tab} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost">Refine with AI</Button>
              <Button variant="ghost">Revert caption</Button>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Media and branding">
            <MediaPanel />
          </Card>
          <Card title="Format checks">
            <FormatChecks />
          </Card>
        </div>
      </div>
    </>
  );
}
