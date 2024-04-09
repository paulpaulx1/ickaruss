import { useEffect, useState } from "react";
import { RouterOutputs, api } from "zicarus/utils/api";


export const useBookingsForDisplay = (userId: string) => {
  const [bookings, setBookings] = useState<RouterOutputs['booking']['getBookingsByUserId']>([]);
  const { data, isLoading, error } = api.booking.getBookingsByUserId.useQuery({ userId });

  useEffect(() => {
    if (data) {
      setBookings(data);
    }
  }, [data])

  console.log(bookings);

  return { bookings, isLoading, error};
}