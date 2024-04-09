import { api } from 'zicarus/utils/api';
import { useSession } from 'next-auth/react';   

export function useUploadVendorImage() {
    const { data: session } = useSession();
    const uploadVendorImage = api.vendor.updateImage.useMutation();

    const updateVendorImage = async (newImageUrl: string) => {
        if (!session?.user?.id) {
            console.error('User ID is not available');
            return;
        }   
        try {
            await uploadVendorImage.mutateAsync({ image: newImageUrl });
            return newImageUrl;
        } catch (error) {
            console.error('Failed to update vendor image', error);
        }
    }

    return {
        updateVendorImage,
        isUpdating: uploadVendorImage.isLoading,
        error: uploadVendorImage.error,
    }

}