import { useSelector } from 'react-redux';

export function usePermissions() {
  const accounts = useSelector((s) => s.accounts.byId);
  const canPublishTo = (platform) => {
    const acc = accounts?.[platform];
    return acc?.status === 'ready';
  };
  return { canPublishTo };
}
