export interface Vendor {
    id: string | null;
    userId:  string | null;
    businessName:  string | null;
    businessDescription:  string | null;
    stripeAccountId: string | null;
    isSubscribed: boolean | null;
    accountCreated: boolean | null;
    image: string | null;
}