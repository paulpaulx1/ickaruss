import React from "react";
import InputField from "@/components/InputField";
import StateSelector from "../components/StateSelector";
import type { FormDataKey, FormData } from "zicarus/types/form";
import { Button } from "./ui/button";

interface ProfileFormProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputFields: { label: string; name: FormDataKey }[];
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  inputFields,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className="max-w-lg flex-1 rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputFields.map((field) => {
          if (field.name !== "state") {
            return (
              <InputField
                key={field.name}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              />
            );
          }
          return null;
        })}
        <StateSelector name="state" value={formData.state} onChange={handleChange} />
        <Button
          type="submit"
          className="w-full"
        >
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;