import { api } from "zicarus/utils/api";

export function useGetAllVendors() {
  const {
    data: vendors,
    isLoading,
    error,
  } = api.vendor.getAllVendors.useQuery();

  return { vendors, isLoading, error }; 
}
