import { create } from 'zustand';
import type { User } from '@/types/user'; 
import type { Vendor } from '@/types/vendor';
import { api } from '../utils/api';
import { DateTime } from 'luxon';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void; 
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    updateUser: (updates) => set((state) => {
      if (state.user) {
        const updatedUser: User = { ...state.user, ...updates };
        return { user: updatedUser };
      }
      return state;
    }),
}));

interface VendorState {
  services: Service[];
  vendor: Vendor | null;
  setVendor: (vendor: Vendor | null) => void;
  updateVendor: (updates: Partial<Vendor>) => void;
  setServices: (services: Service[]) => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  vendor: null,
  services: [],
  setVendor: (vendor) => set({ vendor }),
  updateVendor: (updates) => set((state) => {
    if (state.vendor) {
      const updatedVendor: Vendor = { ...state.vendor, ...updates };
      return { vendor: updatedVendor };
    }
    return state;
  }),
  setServices: (services: Service[]) => set((state) => ({ ...state, services })),
}));

interface Service {
  vendorId: string | null;
  serviceName: string | null;
  serviceDescription: string | null;
  price: number | null;
  currency: string | null;
  video?: string | null;
  imageUrl?: string | null;
  stripeProductId?: string | null;
}

interface ServicesState {
  services: Record<string, Service>; // Using Record<string, Service> for a map
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (stripeProductId: string) => void;
  fetchServices: ()=>Promise<void>;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: {},

  addService: (service) =>
    set((state) => ({
      services: { ...state.services, [service.stripeProductId!]: service },
    })),
  
  updateService: (updatedService) =>
    set((state) => ({
      services: { ...state.services, [updatedService.stripeProductId!]: updatedService },
    })),
  
  deleteService: (stripeProductId) =>
    set((state) => {
      const { [stripeProductId]: _, ...updatedServices } = state.services; // Destructure the service with the specified stripeProductId and get the rest of the services
      return { services: updatedServices };
    }),

  fetchServices: async () => {
      try {
        const serviceData = api.vendor.getTenServices.useQuery();
        if (serviceData.data) {
          const servicesMap: Record<string, Service> = {}; // Define the correct type for servicesMap
          serviceData.data.forEach((service) => {
            if (service.stripeProductId) {
              servicesMap[service.stripeProductId] = { ...service }; // Assign the converted stringId to the id property
            }
          });
          set({ services: servicesMap });
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
}));

interface UnavailabilityDate {
  date: DateTime | null;
  startDateTime: DateTime | null;
  endDateTime: DateTime | null;
}

interface UnavailabilityState {
  unavailableDates: UnavailabilityDate[];
  setUnavailableDates: (dates: UnavailabilityDate[]) => void;
  refresh: () => void;
  addUnavailability: (newUnavailability: UnavailabilityDate) => void;
}

export const useUnavailabilityStore = create<UnavailabilityState>((set, get) => ({
  unavailableDates: [],
  setUnavailableDates: (dates) => set({ unavailableDates: dates }),
  refresh: () => set((state) => ({ unavailableDates: [...state.unavailableDates] })),
  addUnavailability: (newUnavailability) => {
    const currentDates = get().unavailableDates;

    console.log('Updated Unavailable Dates:', [...currentDates, newUnavailability]);

    set({ unavailableDates: [...currentDates, newUnavailability] });
  },
}));

interface  BookingDate {
    date: DateTime | null;
    startDateTime: DateTime | null;
    endDateTime: DateTime | null; 
}

interface BookingState {
  BookingDates: BookingDate[];
  setBookingDates: (dates: BookingDate[]) => void;
  refresh: () => void;
  addBooking: (newBooking: BookingDate) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  BookingDates: [],
  setBookingDates: (dates) => set({ BookingDates: dates }),
  refresh: () => set((state) => ({ BookingDates: [...state.BookingDates] })),
  addBooking: (newBooking) => {
    const currentDates = get().BookingDates;

    console.log('Updated Booking Dates:', [...currentDates, newBooking]);

    set({ BookingDates: [...currentDates, newBooking] });
  },
}));