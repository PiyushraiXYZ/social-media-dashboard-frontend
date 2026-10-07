import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';
import { setProfile } from '../brandSlice.js';

export function CompanyProfileForm() {
  const profile = useSelector((s) => s.brand.profile);
  const dispatch = useDispatch();
  return (
    <Card title="Company profile">
      <div className="space-y-3">
        <Input label="Company / profile name" value={profile.name} onChange={(e) => dispatch(setProfile({ name: e.target.value }))} />
        <Input label="Workspace email" value={profile.email} onChange={(e) => dispatch(setProfile({ email: e.target.value }))} />
        <Button>Save profile</Button>
      </div>
    </Card>
  );
}
