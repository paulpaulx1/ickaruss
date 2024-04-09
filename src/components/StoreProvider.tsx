import React from 'react';
import type { ReactNode } from 'react';
import { useUser } from '@/hooks/useUser';
import { useFetchVendorServices } from 'zicarus/hooks/useFetchVendorServices';
import { useUserStore, useVendorStore } from 'zicarus/store/store';

interface StoreSyncProps {
    children: ReactNode;
  }

const StoreProvider: React.FC<StoreSyncProps> = ({ children }) => {
  useUser();
  const user = useUserStore.getState().user;
  const vendor = useVendorStore.getState().vendor;
  useFetchVendorServices(vendor?.id ?? '');

  return <>{children}</>;
  
};

export default StoreProvider;