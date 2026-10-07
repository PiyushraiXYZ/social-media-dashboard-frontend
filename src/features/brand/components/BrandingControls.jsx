import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useUpdateOverlayMutation } from '../api.js';
import { setOverlay } from '../brandSlice.js';

const POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export function BrandingControls() {
  const overlay = useSelector((s) => s.brand.overlay);
  const dispatch = useDispatch();
  const [updateOverlay, { isLoading }] = useUpdateOverlayMutation();
  const [feedback, setFeedback] = useState(null);

  const handleSave = async () => {
    setFeedback(null);
    try {
      await updateOverlay({
        text: overlay.text,
        position: overlay.position,
        text_size: Number(overlay.text_size) || 40,
      }).unwrap();
      setFeedback({ tone: 'success', message: 'Overlay settings saved ✅' });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Save failed',
      });
    }
  };

  return (
    <Card title="Overlay text">
      <div className="space-y-3 text-sm">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Text
          </label>
          <input
            className="input mt-1"
            value={overlay.text}
            onChange={(e) => dispatch(setOverlay({ text: e.target.value }))}
            placeholder="Build. Learn. Grow."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Position
          </label>
          <select
            className="input mt-1"
            value={overlay.position}
            onChange={(e) => dispatch(setOverlay({ position: e.target.value }))}
          >
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Text size (px)
          </label>
          <input
            type="number"
            className="input mt-1"
            value={overlay.text_size}
            onChange={(e) => dispatch(setOverlay({ text_size: e.target.value }))}
          />
        </div>

        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Apply branding'}
        </Button>
      </div>
    </Card>
  );
}