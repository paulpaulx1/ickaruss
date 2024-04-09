import { useState, useEffect } from "react";
import { api } from "zicarus/utils/api";
import type { User } from "@/types/user";
import { useToast } from "zicarus/components/ui/use-toast";

type FormDataKey = "name" | "city" | "state" | "postalCode";

type FormData = {
  [key in FormDataKey]: string;
};

export const useProfileForm = (
  user: User | null | undefined,
  updateUserProfile: (updatedUser: User) => void,
) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const updateProfile = api.profile.update.useMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        postalCode: user.postalCode ?? "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const updatedUser = await updateProfile.mutateAsync(formData);
      updateUserProfile(updatedUser as User);
      toast({ title: "Success", description: "Profile updated successfully!"})
    } catch (error) {
      console.log('Error updating profile:', error);
      const errorMsg = "Error updating profile.";
      toast({ description: errorMsg, title: "Error"})
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,

  };
};