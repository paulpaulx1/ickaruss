import React, { useEffect, useState } from "react";
import BecomeVendorButton from "zicarus/components/VendorSubscription";
import MakeVendorAccountButton from "zicarus/components/MakeVendorAccount";
import { useVendor } from "zicarus/hooks/useVendor";
import { useUserStore } from "zicarus/store/store";
import CreateServiceForm from "zicarus/components/CreateServiceForm";
import VendorDisplay from "zicarus/components/VendorDisplay";
import { useVendorStore } from "zicarus/store/store";
import { UpdateVendorForm } from "zicarus/components/UpdateVendorForm";
import { buttonClassNames, vendorInputFields } from "zicarus/utils/constants";
import { useUpdateVendor } from "zicarus/hooks/useUpdateVendor";
import { createDashboardLink } from "zicarus/utils/stripeConnectDashLink";
import Link from "next/link";
import PictureUpload from "zicarus/components/PictureUpload";
// import Link from "next/link";

const VendorDashboard =  () => {
  const [stripeConnectDashLink, setStripeConnectDashLink] =
    useState<string>("");
  const { vendor } = useVendorStore((state) => ({ vendor: state.vendor }));
  const { user } = useUserStore((state) => ({ user: state.user }));

  useEffect(() => {
    const fetchStripeDashboardLink = async () => {
      if (vendor?.stripeAccountId) {
        const link = await createDashboardLink(vendor.stripeAccountId);
        setStripeConnectDashLink(link ?? '');
      }
    };

    fetchStripeDashboardLink().catch(console.error);
  }, [vendor?.stripeAccountId]);

  const { updateVendor } = useVendorStore((state) => ({
    updateVendor: state.updateVendor,
  }));

  const userLink = `/profile/${user?.id}`;

  const { formData, handleChange, handleSubmit } = useUpdateVendor(
    vendor,
    updateVendor,
  );

  return (
    <>
      <div className="flex max-w-4xl justify-between px-4 py-10">
        {!vendor?.isSubscribed && (
          <div className={"m-8 flex-col items-center justify-center"}>
            <div className={"m-2"}>
              Subscribe to list Services and Upload Media
            </div>
            <BecomeVendorButton />
          </div>
        )}
        {!vendor?.stripeAccountId && (
          <div className="m-2">
            <div>Make Stripe Account to Accept Payments!</div>
            <MakeVendorAccountButton />
          </div>
        )}
        {vendor && (
          <div className="m-2">
            <VendorDisplay vendor={vendor}></VendorDisplay>
          </div>
        )}
        {vendor?.isSubscribed && (
          <div className="m-2">
            <CreateServiceForm
              vendorId={vendor.id ? vendor.id : ""}
            ></CreateServiceForm>
          </div>
        )}
        {vendor && (
          <div className="m-2 flex flex-col items-center justify-center">
            <UpdateVendorForm
              formData={formData}
              inputFields={vendorInputFields}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            ></UpdateVendorForm>
            <PictureUpload isUserProfile={false}/>
            
            <Link className={buttonClassNames + ' m-auto mr-auto mt-4 w-full'} href={stripeConnectDashLink}>Stripe Dash</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorDashboard;
