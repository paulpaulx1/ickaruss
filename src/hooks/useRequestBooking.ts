import { useState } from "react";
import { api } from "zicarus/utils/api"; 
import { useToast } from "zicarus/components/ui/use-toast";
import { DateTime } from "luxon";
import { BookingRequestPayload } from "zicarus/types/booking";

export const useRequestBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: requestBookingMutation } =
    api.booking.requestBooking.useMutation();

  const requestBooking = async ({
    userId,
    vendorId,
    serviceId,
    startTime,
    businessName,
    endTime,
    date,
  }: BookingRequestPayload) => {
    setIsSubmitting(true);
    try {
      const formattedDate = date.toISODate();
      const isoStringStartTime = `${formattedDate}T${startTime}`;
      const isoStringEndTime = `${formattedDate}T${endTime}`;

      const formattedStartTime = DateTime.fromISO(isoStringStartTime)
        .toUTC()
        .toISO();
      const formattedEndTime = DateTime.fromISO(isoStringEndTime)
        .toUTC()
        .toISO();

      const response = await requestBookingMutation({
        userId,
        vendorId,
        serviceId,
        businessName,
        startTime: formattedStartTime ?? "",
        endTime: formattedEndTime ?? "",
        date: formattedDate ?? "",
      });

      toast({
        title: "Booking Requested",
        description: "Your booking request has been successfully sent.",
      });
    } catch (error) {
      console.error("Error requesting booking:", error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { requestBooking, isSubmitting };
};
