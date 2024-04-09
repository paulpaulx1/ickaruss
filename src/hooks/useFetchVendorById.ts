import { api } from "zicarus/utils/api";
import { useRouter } from "next/router";

export function useFetchVendorByID() {
    const router = useRouter();
    const { vendorId } = router.query;

    const normalizedVendorId = Array.isArray(vendorId) ? vendorId[0] : vendorId;

  const {
    data: vendor,
    isLoading,
    error,
  } = api.vendor.getVendorByID.useQuery(
    {
      vendorId: normalizedVendorId ?? '', 
    },
    {
      enabled: !!normalizedVendorId, 
    },
  );

  return { vendor, isLoading, error };
}