import { useState, useEffect } from "react";
import { api } from "zicarus/utils/api";
import type { Vendor } from "@/types/vendor";
import { useToast } from "zicarus/components/ui/use-toast";

interface VendorFormData {
    businessName: string;
    businessDescription: string;
}

export const useUpdateVendor = (
    vendor: Vendor | null | undefined,
    updateVendorProfile: (updatedVendor: Vendor) => void,
) => {
    const [formData, setFormData] = useState<VendorFormData>({
        businessName: "",
        businessDescription: "",
    });

    const { toast } = useToast();

    const updateVendor = api.vendor.update.useMutation();

    useEffect(() => {
        if (vendor) {
            setFormData({
                businessName: vendor.businessName ?? "",
                businessDescription: vendor.businessDescription ?? "",
            });
        }
    }, [vendor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const updatedVendor = await updateVendor.mutateAsync({vendorId: vendor?.id ?? '', ...formData});
            updateVendorProfile(updatedVendor as Vendor);
            toast({ title: "Success", description: "Profile updated successfully!" });
        } catch (error) {
            console.error('Error updating profile', error);
            toast({ description: "Error updating profile.", title: "Error" });
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
    };
};