import { useToast } from "../components/ui/use-toast";
import { api } from "zicarus/utils/api";
import { DateTime } from "luxon";
import { useUnavailabilityStore } from "zicarus/store/store";

import {
  UnavailabilityPayload,
  UnavailabilityData,
  AddUnavailabilityResult,
} from "zicarus/types/unavailability";
import { use } from "react";

export const useAddUnavailability = (vendorId: string) => {
  const { toast } = useToast();
  const { mutateAsync: addUnavailabilityMutation } =
    api.vendor.addUnavailability.useMutation();

  const unavailabilityStore = useUnavailabilityStore()

  const addUnavailability = async ({
    date,
    startTime,
    endTime,
    isRecurring,
  }: UnavailabilityPayload): Promise<AddUnavailabilityResult> => {
    try {
      const formattedDate = date.toISODate(); 
      const isoStringStartTime = `${formattedDate}T${startTime}`;
      const isoStringEndTime = `${formattedDate}T${endTime}`;
      
      const formattedStartTime = DateTime.fromISO(isoStringStartTime).toUTC().toISO();
      const formattedEndTime = DateTime.fromISO(isoStringEndTime).toUTC().toISO();
      
      const payload: UnavailabilityData = {
        date: date?.toISO() ?? "",
        vendorId,
        startTime: formattedStartTime ?? "",
        endTime: formattedEndTime ?? "",
        dayOfWeek: date?.weekday ?? 0,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isRecurring,
      };

      await addUnavailabilityMutation(payload);
      const newUnavailability = {
        date: date,
        startDateTime: DateTime.fromISO(formattedStartTime ?? ''),
        endDateTime: DateTime.fromISO(formattedEndTime ?? ''),
      };

      unavailabilityStore.addUnavailability(newUnavailability);

      toast({
        title: "Unavailability Added",
        description: "The unavailability has been successfully added.",
      });

      return { success: true };
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error adding the unavailability. Please try again.",
      });

      console.error("Error setting unavailability:", error);
      return {
        success: false,
        message: "There was an error adding the unavailability.",
      };
    }
  };

  return { addUnavailability };
};
