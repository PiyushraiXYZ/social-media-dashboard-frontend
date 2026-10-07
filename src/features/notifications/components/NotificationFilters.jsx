import { Tabs } from '../../../components/ui/Tabs/Tabs.jsx';

export function NotificationFilters({ value, onChange }) {
  return (
    <Tabs
      active={value}
      onChange={onChange}
      tabs={[
        { value: 'all', label: 'All updates' },
        { value: 'unread', label: 'Unread' },
        { value: 'approval', label: 'Approval' },
        { value: 'publishing', label: 'Publishing' },
        { value: 'accounts', label: 'Accounts' },
      ]}
    />
  );
}

