import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal/Modal.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useCreateAdminAccountMutation } from '../api.js';

export function CreateAdminModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [address, setAddress] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const [feedback, setFeedback] = useState(null);
  const [created, setCreated] = useState(null);

  const [createAdmin, { isLoading }] = useCreateAdminAccountMutation();

  const reset = () => {
    setEmail('');
    setPassword('');
    setOrgName('');
    setAddress('');
    setInviteCode('');
    setFeedback(null);
    setCreated(null);
  };

  const handleClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setFeedback(null);
    setCreated(null);

    if (!email.includes('@')) {
      setFeedback({ tone: 'danger', message: 'Invalid email' });
      return;
    }
    if (password.length < 8) {
      setFeedback({
        tone: 'danger',
        message: 'Password min 8 characters',
      });
      return;
    }
    if (!orgName.trim()) {
      setFeedback({ tone: 'danger', message: 'Organization name required' });
      return;
    }

    try {
      const res = await createAdmin({
        email: email.trim().toLowerCase(),
        password,
        org_name: orgName.trim(),
        address: address.trim() || null,
        invite_code: inviteCode.trim() || null,
      }).unwrap();

      setCreated({
        email: res.email,
        userId: res.user_id,
        orgName: res.org_name,
        inviteCode: res.invite_code,
      });
      setFeedback({ tone: 'success', message: 'Admin created ✅' });
    } catch (err) {
      setFeedback({
        tone: 'danger',
        message: err?.data?.detail || 'Failed to create admin',
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create admin account"
      footer={
        created ? (
          <>
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={() => reset()}>Create another</Button>
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
              {isLoading ? 'Creating…' : 'Create admin'}
            </Button>
          </>
        )
      }
    >
      {!created ? (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            This admin will be able to create and manage their own
            users under the specified organization.
          </p>

          <Input
            label="Admin email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            disabled={isLoading}
          />

          <Input
            label="Temporary password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            disabled={isLoading}
          />

          <Input
            label="Organization name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="ShilshaTech"
            disabled={isLoading}
          />

          <Input
            label="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Mumbai, India"
            disabled={isLoading}
          />

          <Input
            label="Invite code (optional)"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="SHIL-2026"
            disabled={isLoading}
          />

          {feedback && (
            <Alert tone={feedback.tone}>{feedback.message}</Alert>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Alert tone="success" title="Admin created successfully ✅">
            Share these credentials securely with the admin.
          </Alert>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
            <div>
              <div className="text-xs uppercase text-slate-500">Email</div>
              <div className="mt-1 font-medium">{created.email}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">
                Organization
              </div>
              <div className="mt-1 font-medium">{created.orgName}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-slate-500">
                Admin ID
              </div>
              <div className="mt-1">#{created.userId}</div>
            </div>
            {created.inviteCode && (
              <div>
                <div className="text-xs uppercase text-slate-500">
                  Invite code
                </div>
                <div className="mt-1 font-mono">{created.inviteCode}</div>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            ⚠️ Password won't be shown again after closing this modal.
          </p>
        </div>
      )}
    </Modal>
  );
}