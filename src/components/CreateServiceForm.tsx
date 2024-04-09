import React from "react";
import { useCreateServiceForm } from "@/hooks/useCreateServiceForm";
import InputField from "./InputField";
import { Button } from "./ui/button";

interface CreateServiceFormProps {
  vendorId: string;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({ vendorId }) => {
  const { formData, handleChange, handleSubmit } = useCreateServiceForm(
    vendorId,
  );

  return (
    <div className="max-w-lg flex-1 rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Create A Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Service Name"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
        />
        <InputField
          label="Description"
          name="serviceDescription"
          value={formData.serviceDescription}
          onChange={handleChange}
        />
        <InputField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <Button
          type="submit"
        >
          Create Service
        </Button>
      </form>
    </div>
  );
};

export default CreateServiceForm;
