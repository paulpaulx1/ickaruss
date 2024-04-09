// components/SessionSync.tsx
import React from 'react';
import type { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { useVendor } from '@/hooks/useVendor';

interface SessionSyncProps {
    children: ReactNode;
  }

const UserSync: React.FC<SessionSyncProps> = ({ children }) => {
  useVendor();
  useUser();
  return <>{children}</>;
  
};

export default UserSync;