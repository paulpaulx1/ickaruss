import { RouterOutputs, api } from 'zicarus/utils/api';
import { useState, useEffect } from 'react';


export const useFetchVendorServices = (vendorId: string) => {
  const [services, setServices] = useState<RouterOutputs['vendor']['getServicesByVendorId']>([]);
  const { data, isLoading, error } = api.vendor.getServicesByVendorId.useQuery({vendorId});

  useEffect(() => {
    if (data) {
      setServices(data);
    }
  }, [data]);
  return { services, isLoading, error };
};