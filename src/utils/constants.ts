import { FormDataKey, VendorFormDataKey } from "zicarus/types/form";

export const buttonClassNames = " inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mr-6"

export   const userInputFields: { label: string; name: FormDataKey }[] = [
    { label: "Name", name: "name" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
    { label: "Postal Code", name: "postalCode" },
  ];


export const vendorInputFields: { label: string; name: VendorFormDataKey }[] = [
    { label: "Business Name", name: "businessName" },
    { label: "Business Description", name: "businessDescription" },

]