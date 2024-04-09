export interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    isVendor?: boolean;
  }

export interface UserProfile {
    name: string;
    email: string;
    city: string;
    state: string;
    postalCode: string;
    image: string;
  }