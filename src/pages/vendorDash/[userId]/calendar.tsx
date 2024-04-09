import React from "react";
import BookingsTable from "zicarus/components/BookingsTable";
import UnavailabilitySetter from "zicarus/components/UnavailabilitySetter";

const CalendarPage: React.FC = () => {
  return (
    <div>
      <BookingsTable />
      <UnavailabilitySetter />
    </div>
  );
};

export default CalendarPage;
