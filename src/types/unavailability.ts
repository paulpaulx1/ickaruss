import { DateTime } from "luxon";

export interface Unavailability {
    date: DateTime | null;
    startDateTime: DateTime | null;
    endDateTime: DateTime | null;
}

 export interface UnavailabilityPayload {
    date: DateTime;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
  }

  export interface UnavailabilityData {
    date: string;
    vendorId: string;
    startTime: string;
    endTime: string;
    dayOfWeek: number;
    timeZone: string;
    isRecurring: boolean;
  }

 export interface AddUnavailabilityResult {
    success: boolean;
    message?: string;
  }
