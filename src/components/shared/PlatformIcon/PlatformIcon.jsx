import { Facebook, Instagram, Linkedin } from 'lucide-react';

const map = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin };

export function PlatformIcon({ platform, size = 14, className = '' }) {
  const Icon = map[platform] || Facebook;
  return <Icon size={size} className={className} />;
}
