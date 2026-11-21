import {
  HardDriveDownload,
  KeyRound,
  Laptop,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import type { DomainInfo } from '../data/flashcardsData';

interface DomainIconProps {
  iconName: DomainInfo['iconName'];
  className?: string;
}

export function DomainIcon({ iconName, className = 'w-4 h-4' }: DomainIconProps) {
  switch (iconName) {
    case 'key':
      return <KeyRound className={className} aria-hidden="true" />;
    case 'shield-alert':
      return <ShieldAlert className={className} aria-hidden="true" />;
    case 'user-check':
      return <UserCheck className={className} aria-hidden="true" />;
    case 'laptop':
      return <Laptop className={className} aria-hidden="true" />;
    case 'hard-drive':
      return <HardDriveDownload className={className} aria-hidden="true" />;
  }
}
