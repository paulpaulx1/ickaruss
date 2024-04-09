import { DateTime } from "luxon";

export interface BookingRequestPayload {
    userId: string;
    vendorId: string;
    serviceId: number;
    date: DateTime;
    startTime: string;
    endTime: string;
    businessName: string;
    id: number;

}

export interface Booking {
    id: number;
    date: string | null;
    startTime: string | null;
    endTime: string | null;
    status: string | null;
    depositPaid: boolean | null; 
    finalPaymentPaid: boolean | null;
    service: { name: string | null; id: number; depositPriceId: string; finalPaymentPriceId: string; } | null;
    vendor: { businessName: string | null; id: number; } | null;
  }
  