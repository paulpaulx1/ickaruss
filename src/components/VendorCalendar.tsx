import { LooseValue } from 'node_modules/react-calendar/dist/esm/shared/types';
import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Ensure CSS is imported if needed
import { CalendarValue } from '@/types/calendar';

interface VendorCalendarProps { 
    selectedDate: Date | Date[]; // Allow Date array for range
    onChange: (date: CalendarValue, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    tileClassName: ({ date, view }: { date: Date, view: string }) => string | null; // Match react-calendar expected params
}

const VendorCalendar: React.FC<VendorCalendarProps> = ({ selectedDate, onChange, tileClassName }) => {
    return (
        <div className="flex-col items-center justify-center mb-4">
            <Calendar
                onChange={(value, event) => onChange(value as CalendarValue, event)}
                value={selectedDate as LooseValue | undefined} 
                className="rounded-lg border border-gray-200 shadow-lg items-center justify-center"
                tileClassName={({ date, view }) => tileClassName({ date, view })} 
            />
        </div>
    );
};

export default VendorCalendar;