import VendorDisplay from "../../components/VendorDisplay";
import { useFetchVendorByID } from "@/hooks/useFetchVendorById";
import Link from "next/link";
import VendorCalendar from "@/components/VendorCalendar";
import { useUnavailabilityStore } from "zicarus/store/store";
import { CalendarValue, tileClassNameProps } from "zicarus/types/calendar";
import { DateTime } from "luxon";
import { use, useState } from "react";
import { useUnavailability } from "zicarus/hooks/useUnavailability";
import TimeOfDaySelector from "zicarus/components/TimeOfDaySelector";
import { toast } from "zicarus/components/ui/use-toast";
import { useRequestBooking } from "zicarus/hooks/useRequestBooking";
import { useSession } from "next-auth/react";
import ServiceDropdown from "zicarus/components/ServiceDropdown";
import { Service } from "zicarus/types/service";
import { Button } from "zicarus/components/ui/button";

const VendorPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const { vendor, isLoading, error } = useFetchVendorByID();
  const { requestBooking } = useRequestBooking();
  const { data: session } = useSession();

  //Synch state for unavails
  useUnavailability(vendor?.id ?? "", selectedDate.getTime());
  const { unavailableDates } = useUnavailabilityStore((state) => ({
    unavailableDates: state.unavailableDates,
  }));

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime || !vendor?.id) {
      toast({ description: "Invalid form data", title: "error" });
      return;
    }

    try {
      const formattedDate = DateTime.fromJSDate(selectedDate).toISODate();
      await requestBooking({
        date: DateTime.fromISO(formattedDate ? formattedDate : ""),
        startTime,
        endTime,
        businessName: vendor?.businessName ?? "",
        vendorId: vendor?.id,
        userId: session?.user.id ?? "",
        serviceId: selectedServiceId ?? 0,
        id: selectedServiceId ?? 0,
      });

      toast({
        description: "Booking requested successfully",
        title: "Success",
      });
    } catch (error) {
      console.error("Error requesting booking:", error);
      toast({
        description: "Error requesting booking. Please try again.",
        title: "Error",
      });
    }
  };

  const tileClassName = ({ date, view }: tileClassNameProps) => {
    if (view === "month") {
      return unavailableDates.some(
        (unavailableDate) =>
          unavailableDate?.date &&
          DateTime.fromJSDate(date)
            .startOf("day")
            .equals(unavailableDate.date.startOf("day")),
      )
        ? "unavailable-date"
        : "";
    }
    return "";
  };

  const handleDateChange = (value: CalendarValue) => {
    const newDate = Array.isArray(value) ? value[0] : value;
    if (newDate) setSelectedDate(newDate);
  };

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-8">
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : vendor ? (
        <>
          <div className="flex items-center justify-center">
            <div className="m-2 text-center">
              <VendorDisplay vendor={vendor} />
            </div>
            <div className="m-2">
              <h1>Request Booking</h1>
              <VendorCalendar
                selectedDate={selectedDate}
                tileClassName={tileClassName}
                onChange={handleDateChange}
              />
              <TimeOfDaySelector
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                isRecurring={isRecurring}
                setIsRecurring={setIsRecurring}
              ></TimeOfDaySelector>
              <ServiceDropdown
                vendorId={vendor.id}
                onSelect={(service: Service) =>
                  setSelectedServiceId(service?.id ?? null)
                }
              />
              <br />
              <div className="mx-4">
                <Button onClick={handleSubmit}>Request Booking</Button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="text-blue-500 hover:text-blue-700"></Link>
          </div>
        </>
      ) : (
        <p className="text-center text-red-500">Vendor not found.</p>
      )}
    </div>
  );
};

export default VendorPage;
