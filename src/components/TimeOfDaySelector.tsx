import { Label } from "./ui/label";

interface TimeOfDaySelectorProps {
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
}

const TimeOfDaySelector: React.FC<TimeOfDaySelectorProps> = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}) => (
  <>
    <div className="mb-4 flex flex-col w-[80%]"> 
      <div className="w-full">
        <Label className="mb-2 text-sm font-semibold block">Start Time:</Label> {/* Ensured label is block level */}
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full rounded-lg border border-gray-200 p-2" // Adjusted margins
        />
      </div>
      <div className="w-full">
        <Label className="mb-2 text-sm font-semibold block">End Time:</Label> {/* Ensured label is block level */}
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full rounded-lg border border-gray-200 p-2" // Adjusted margins
        />
      </div>
    </div>
  </>
);

export default TimeOfDaySelector;
