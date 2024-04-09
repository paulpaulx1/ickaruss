export interface Service {
    id: number | null;
    vendorId: string | null;
    serviceName: string | null; // Ensure this matches the actual data
    serviceDescription: string | null;
    price: number | null;
    currency: string | null;
    video: string | null;
    stripeProductId: string | null;
    videoUrl?: string | null; // Optional video URL field
    imageUrl?: string | null; // Optional image URL field

}