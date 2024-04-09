import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { DateTime } from "luxon";
import { Button } from "./ui/button";
import { useVendorStore } from "zicarus/store/store";
import { useToast } from "./ui/use-toast";
import TimeOfDaySelector from "./TimeOfDaySelector";
import TimeSlotList from "./TimeslotList";
import { useAddUnavailability } from "zicarus/hooks/useAddUnavailability";
import VendorCalendar from "./VendorCalendar";
import { CalendarValue } from "@/types/calendar";
import { useUnavailabilityStore } from "zicarus/store/store";
import { useUnavailability } from "zicarus/hooks/useUnavailability";
import { tileClassNameProps } from "zicarus/types/calendar";

const UnavailabilitySetter: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const { toast } = useToast();
  const vendorId = useVendorStore((state) => state.vendor?.id);

  useUnavailability(vendorId ?? "", selectedDate.getTime());

  const unavailableDates = useUnavailabilityStore(
    (state) => state.unavailableDates,
  );

  const { addUnavailability } = useAddUnavailability(vendorId ?? "");

  const handleDateChange = (value: CalendarValue) => {
    const newDate = Array.isArray(value) ? value[0] : value;
    if (newDate) setSelectedDate(newDate);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime || !vendorId) {
      toast({ description: "Invalid form data", title: "error" });
      return;
    }

    const formattedDate = DateTime.fromJSDate(selectedDate).toISODate();
    const success = await addUnavailability({
      date: DateTime.fromISO(formattedDate ? formattedDate : ""),
      startTime,
      endTime,
      isRecurring,
    });

    if (success) {
      toast({
        description: "Unavailability added successfully",
        title: "Success",
      });
    } else {
      toast({ description: "Error adding unavailability", title: "Error" });
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

  return (
    <div className="flex p-4">
      <div className="flex w-[420px] flex-col items-center justify-center">
        <VendorCalendar
          selectedDate={selectedDate}
          onChange={handleDateChange}
          tileClassName={tileClassName}
        />
        <TimeOfDaySelector
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          isRecurring={isRecurring}
          setIsRecurring={setIsRecurring}
        />
        <Button onClick={handleSubmit} className="mt-4 w-[90%] self-center">
          Set Unavailability
        </Button>
      </div>
      <div className="flex-1 p-4">
        <TimeSlotList selectedDate={selectedDate} viewMode="month" />
      </div>
    </div>
  );
};

export default UnavailabilitySetter;
