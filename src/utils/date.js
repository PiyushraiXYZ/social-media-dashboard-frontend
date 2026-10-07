import { format, formatDistanceToNow } from 'date-fns';

export const fmtUTC = (d, pattern = 'dd MMM · HH:mm') => {
  const date = d instanceof Date ? d : new Date(d);
  return `${format(date, pattern)} UTC`;
};

export const relative = (d) => formatDistanceToNow(new Date(d), { addSuffix: true });

export const toISO = (d) => new Date(d).toISOString();
