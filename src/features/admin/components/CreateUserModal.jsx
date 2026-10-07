import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal/Modal.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useCreateManagedUserMutation } from '../api.js';

export function CreateUserModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [createdInfo, setCreatedInfo] = useState(null);

  const [createUser, { isLoading }] = useCreateManagedUserMutation();

  const reset = () => {
    setEmail('');
    setPassword('');
    setFeedback(null);
    setCreatedInfo(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setFeedback(null);
    setCreatedInfo(null);

    if (!email.trim()) {
      setFeedback({ tone: 'danger', message: 'Email required' });
      return;
    }
    if (!email.includes('@')) {
      setFeedback({ tone: 'danger', message: 'Invalid email' });
      return;
    }
    if (!password || password.length < 8) {
      setFeedback({
        tone: 'danger',
        message: 'Password must be at least 8 characters',
      });
      return;
    }

    try {
      const res = await createUser({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      setCreatedInfo({
        email: res.email,
        userId: res.user_id,
        password: res.password || password, // backend returns same password in response
      });

      setFeedback({
        tone: 'success',
        message: `User created successfully ✅`,
      });
    } catch (err) {
      const message =
        err?.data?.detail ||
        err?.error ||
        'Failed to create user. Try again.';
      setFeedback({ tone: 'danger', message });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create managed user"
      footer={
        createdInfo ? (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                reset();
                // Keep modal open for creating another
              }}
            >
              Create another
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating…' : 'Create user'}
            </Button>
          </>
        )
      }
    >
      {!createdInfo ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            This user will be linked to your admin account. Share the
            credentials with them securely — they can log in and start
            using SocialDesk immediately.
          </p>

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@company.com"
            disabled={isLoading}
            autoFocus
          />

          <Input
            label="Password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            disabled={isLoading}
          />

          <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
            💡 Save this password — you'll need to share it with the
            user. They can change it after logging in.
          </div>

          {feedback && (
            <Alert tone={feedback.tone}>{feedback.message}</Alert>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Alert tone="success" title="User created successfully ✅">
            Share these credentials with your new user securely.
          </Alert>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <div className="text-xs uppercase text-slate-500">Email</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <code className="text-sm font-medium text-slate-800">
                  {createdInfo.email}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(createdInfo.email)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-slate-500">
                Password
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <code className="text-sm font-medium text-slate-800">
                  {createdInfo.password}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(createdInfo.password)}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <div className="text-xs uppercase text-slate-500">
                User ID
              </div>
              <div className="mt-1 text-sm text-slate-800">
                #{createdInfo.userId}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            ⚠️ Password won't be shown again after closing this modal.
          </p>
        </div>
      )}
    </Modal>
  );
}