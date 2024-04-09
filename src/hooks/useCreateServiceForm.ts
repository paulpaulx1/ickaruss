import { useState } from "react";
import { useServicesStore } from "../store/store";
import { api } from "zicarus/utils/api"; // Adjust the import path as needed
import { useToast } from "zicarus/components/ui/use-toast";

// Assuming these are the fields for your service form
type FormData = {
  vendorId: string;
  serviceName: string;
  serviceDescription: string;
  price: string; // Keeping price as string for form handling, but will convert to number for submission
  currency: string;
};

export const useCreateServiceForm = (vendorId: string) => {
  const [formData, setFormData] = useState<FormData>({
    vendorId,
    serviceName: "",
    serviceDescription: "",
    price: "",
    currency: "USD", // Default currency
  });

  const { addService } = useServicesStore();
  const { toast } = useToast();
  const utils = api.useUtils();

  const createService = api.vendor.createService.useMutation({
    onSuccess: async () => {
      await utils.vendor.getServicesByVendorId.invalidate({ vendorId });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      const serviceData = {
        ...formData,
        price: Number(formData.price), // Convert price to number before submission
      };

      const response = await createService.mutateAsync(serviceData);

      if (response.success) {
        const { service } = response;
        addService(service);
        toast({
          title: "Success",
          description: "Created service successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong. You did not create a service.",
        });
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
