import React from "react";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

const VendorSubscribeButton: React.FC = () => {
  const upgradeVendorSubscription = api.stripe.upgradeVendorSubscription.useMutation();
  const session = useSession();
  const userId = session.data?.user?.id;
  const VENDOR_SUBSCRIPTION_PRICE_ID = "price_1OoZ0pHLAzF5yr08DAALdT2n";

  const handleBecomeVendor = async () => {
    if (userId) {
      try {
        const priceId = VENDOR_SUBSCRIPTION_PRICE_ID;
        const response = await upgradeVendorSubscription.mutateAsync({
          priceId,
          userId,
        });
        if (response.url) {
          window.open(response.url, "_blank");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  return (
    <Button onClick={handleBecomeVendor}>
      Subscribe For Full Vendor Access
    </Button>
  );
};

export default VendorSubscribeButton;
