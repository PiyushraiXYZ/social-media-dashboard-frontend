import { useState } from 'react';
import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';
import { Input } from '../../../components/ui/Input/Input.jsx';

export function PostFilters() {
  const [tab, setTab] = useState('all');
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { value: 'all', label: 'All posts' },
          { value: 'pending', label: 'Pending approval' },
          { value: 'approved', label: 'Approved' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'failed', label: 'Failed' },
          { value: 'drafts', label: 'Drafts' },
          { value: 'published', label: 'Published' },
          { value: 'expired', label: 'Expired' },
        ]}
      />
      <div className="ml-auto w-64">
        <Input placeholder="Search title or post reference" />
      </div>
    </div>
  );
}
