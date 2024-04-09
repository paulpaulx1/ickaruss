import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore, useVendorStore } from "../store/store";
import { api } from "zicarus/utils/api";
import { Vendor } from "zicarus/types/vendor";
import { useUser } from "./useUser";

export function useVendor() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { user } = useUser();

  const {
    data: vendor,
    isLoading,
    error,
  } = api.vendor.getVendorByUserID.useQuery(
    { userId: userId ?? "" },
    { enabled: !!userId },
  );

  const setVendor = useVendorStore((state) => state.setVendor);

  useEffect(() => {

    if (!user?.isVendor) return;

    if (vendor) {
      setVendor(vendor as Vendor);
    }
  }, [vendor, setVendor]);

  const services = api.vendor.getServicesByVendorId.useQuery(
    { vendorId: vendor?.id ?? "" },
    { enabled: !!vendor?.id },
  );

  useEffect(() => {

    if (!user?.isVendor) return;

    if (services.data) {
      useVendorStore.setState((state) => ({ ...state, services: services.data }));
    }
  }, [services]);

  return user?.isVendor ? { vendor, isLoading, error } : { vendor: null, isLoading: false, error: null }; 
}
