import { useEffect } from "react";
import { api } from "zicarus/utils/api";
import { DateTime } from "luxon";
import { useToast } from "zicarus/components/ui/use-toast";
import { useUnavailabilityStore } from "zicarus/store/store";

export const useUnavailability = (vendorId: string, refreshKey: number) => {
  const { toast } = useToast();
  const setUnavailableDates = useUnavailabilityStore(state => state.setUnavailableDates);

  const { data: unavailabilityData } = api.vendor.getUnavailabilitiesByVendorId.useQuery({ vendorId });

  useEffect(() => {
    if (!vendorId || !unavailabilityData) return;

    try {
      const processedUnavailabilities = unavailabilityData.map(unavailability => {
        const date = unavailability.date ? DateTime.fromISO(unavailability.date).toLocal().startOf("day") : null;
        const startDateTime = unavailability.startTime ? DateTime.fromISO(unavailability.startTime).toLocal() : null;
        const endDateTime = unavailability.endTime ? DateTime.fromISO(unavailability.endTime).toLocal() : null;
        return { date, startDateTime, endDateTime };
      });

      setUnavailableDates(processedUnavailabilities);
      console.log('processed unavailabilities',processedUnavailabilities);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch unavailabilities.",
      });
    }
  }, [vendorId, unavailabilityData, setUnavailableDates, toast, refreshKey]);
};