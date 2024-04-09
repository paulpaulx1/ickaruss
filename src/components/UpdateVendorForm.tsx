import React from "react";
import InputField from "@/components/InputField";
import type { FormDataKey, FormData, VendorFormData, VendorFormDataKey } from "zicarus/types/form";
import { Button } from "./ui/button";

interface ProfileFormProps {
  formData: VendorFormData,
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputFields: { label: string; name: VendorFormDataKey }[];
}

export const UpdateVendorForm: React.FC<ProfileFormProps> = ({
  formData,
  inputFields,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="max-w-lg flex-1 rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Edit Business Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputFields.map((field) => {
            return (
              <InputField
                key={field.name}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            );
        })}
        <Button
          type="submit"
          className="w-full"
        >
          Update Business Profile
        </Button>
      </form>
    </div>
  );
};

