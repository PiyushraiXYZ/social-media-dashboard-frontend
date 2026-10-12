import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal/Modal.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useCreateBrandMutation } from '../api.js';

export function CreateBrandModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const reset = () => {
    setName('');
    setDescription('');
    setFeedback(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setFeedback(null);

    if (!name.trim() || name.trim().length < 2) {
      setFeedback({
        tone: 'danger',
        message: 'Brand name required (min 2 chars)',
      });
      return;
    }

    try {
      const res = await createBrand({
        name: name.trim(),
        description: description.trim() || null,
      }).unwrap();

      setFeedback({ tone: 'success', message: 'Brand created ✅' });
      onCreated?.(res);
      setTimeout(() => {
        reset();
        onClose();
      }, 800);
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Failed to create brand',
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create a new brand"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating…' : 'Create brand'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Each brand has its own workspace — separate social accounts,
          posts, calendar, and analytics.
        </p>

        <Input
          label="Brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Shilsha Technologies"
          disabled={isLoading}
          autoFocus
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Description — optional
          </label>
          <textarea
            rows={3}
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tech education platform for developers"
            disabled={isLoading}
          />
        </div>

        {feedback && <Alert tone={feedback.tone}>{feedback.message}</Alert>}
      </div>
    </Modal>
  );
}