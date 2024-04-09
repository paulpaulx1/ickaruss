import React, { use } from "react";
import { api } from "../utils/api"; // Adjust the import path as needed
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

const MakeVendorAccountButton: React.FC = () => {
  const createVendorStripeAccount =
    api.stripe.createVendorAccount.useMutation();
  const { toast } = useToast();

  const handleMakeVendorAccount = async () => {
    try {
      const response = await createVendorStripeAccount.mutateAsync();
      if (response.onboardingUrl) {
        window.location.href = response.onboardingUrl;
      }
    } catch (error) {
      console.error("Error initiating vendor onboarding:", error);
      toast({
        description: "Error initiating vendor onboarding",
        title: "Error",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleMakeVendorAccount}
      className={"mr-6"}
    >
      Make Vendor Account
    </Button>
  );
};

export default MakeVendorAccountButton;
