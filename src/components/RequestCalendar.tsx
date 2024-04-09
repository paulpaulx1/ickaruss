import React from 'react';
import { Calendar } from "react-calendar";
import { LooseValue } from 'node_modules/react-calendar/dist/esm/shared/types';
import 'react-calendar/dist/Calendar.css';
import { CalendarValue } from '@/types/calendar';

interface RequestCalendarProps {
    selectedDate: Date | Date[];
    onChange: (date: CalendarValue, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tileClassName: ({ date, view }: { date: Date, view: string }) => string | null;
}

const RequestCalendar: React.FC<RequestCalendarProps> = ({ selectedDate, onChange, tileClassName }) => {
    return (
        <div className="mb-4">
            <h1 className="mb-4 text-2xl font-bold">Select Date</h1>
            <Calendar
                onChange={(value, event) => onChange(value as CalendarValue, event)}
                value={selectedDate as LooseValue | undefined}
                className="rounded-lg border border-gray-200 shadow-lg"
                tileClassName={({ date, view }) => tileClassName({ date, view })}
            />
        </div>
    );
}