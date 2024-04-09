import React from "react";
import { DateTime } from "luxon";
import { useUnavailabilityStore } from "zicarus/store/store";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
       
interface TimeSlotListProps {
  selectedDate: Date | [Date, Date] | null;
  viewMode: string;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  selectedDate,
  viewMode,
}) => {
  const unavailableDates = useUnavailabilityStore(
    (state) => state.unavailableDates,
  );

  if (!selectedDate) return null;

  const selectedDateTime = Array.isArray(selectedDate)
    ? DateTime.fromJSDate(selectedDate[0])
    : DateTime.fromJSDate(selectedDate);
  const startOfPeriod =
    viewMode === "week"
      ? selectedDateTime.startOf("week")
      : selectedDateTime.startOf("month");
  const endOfPeriod =
    viewMode === "week"
      ? selectedDateTime.endOf("week")
      : selectedDateTime.endOf("month");
  const today = DateTime.now();

  // Filter based on the selected period
  const periodUnavailabilities = unavailableDates.filter(({ date }) => {
    const unavailabilityDate = date ? DateTime.fromISO(date.toISO()!) : null; // Adjusted to work with your DateTime objects
    return (
      unavailabilityDate &&
      unavailabilityDate >= startOfPeriod &&
      unavailabilityDate <= endOfPeriod &&
      unavailabilityDate > today
    );
  });
  return periodUnavailabilities.length === 0 ? (
    <div>No unavailabilities for this {viewMode}.</div>
  ) : (
    <Table>
      <TableCaption>
        Upcoming Unavailable Time Slots
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>End Time</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {periodUnavailabilities.map((unavailability, index) => (
          <TableRow key={index}>
            <TableCell>
              {unavailability?.date?.toFormat("cccc, LLLL d")}
            </TableCell>
            <TableCell>
              {unavailability?.startDateTime?.toFormat("T")}
            </TableCell>
            <TableCell>{unavailability?.endDateTime?.toFormat("T")}</TableCell>
            <TableCell>
              {unavailability?.date?.hasSame(today, "day") && "Today"}
            </TableCell>
            <TableCell>
              Hey unavailability ;)
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TimeSlotList;
