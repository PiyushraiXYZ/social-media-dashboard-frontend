export const isPublishReady = (account) =>
  account?.status === 'ready' && account?.connected === true;

export const filterPublishableAccounts = (accounts = []) =>
  accounts.filter(isPublishReady);

