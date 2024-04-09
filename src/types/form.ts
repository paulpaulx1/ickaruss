export type FormDataKey = "name" | "city" | "state" | "postalCode";

export interface FormData {
  name: string;
  city: string;
  state: string;
  postalCode: string;
//   image: string;
}

export type VendorFormDataKey = "businessName" | "businessDescription";

export interface VendorFormData {
  businessName: string;
  businessDescription: string;
}