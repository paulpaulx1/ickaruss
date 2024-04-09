import React from "react";
import { useUserStore, useVendorStore } from "../../store/store";
import { useProfileForm } from "@/hooks/useProfileForm";
import type { User } from "@/types/user";
import ProfileForm from "@/components/ProfileForm";
import ProfileDisplay from "zicarus/components/ProfileDisplay";
import PictureUpload from "zicarus/components/PictureUpload";
import VendorSubscriptionButton from "zicarus/components/VendorSubscription";
import MakeVendorAccountButton from "zicarus/components/MakeVendorAccount";
import Link from "next/link";
import { buttonClassNames } from "zicarus/utils/constants";
import { userInputFields } from "zicarus/utils/constants";

const Profile: React.FC = () => {
  const { user, updateUser } = useUserStore((state) => ({
    user: state.user,
    updateUser: state.updateUser,
  }));

  const { vendor } = useVendorStore((state) => ({
    vendor: state.vendor,
  }));

  const updateUserProfile = (updatedFields: Partial<User>) => {
    updateUser(updatedFields);
  };

  const { formData, handleChange, handleSubmit } = useProfileForm(
    user,
    updateUserProfile,
  );

  const vendorLink = `/vendorDash/${user?.id}`;

  return (
    <div className="flex flex-col justify-center gap-x-8  p-4 md:flex-row">
      <div className="min-w-80 flex-col">
        <ProfileForm
          formData={formData}
          inputFields={userInputFields}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <div className="m-6 flex min-w-80 flex-row justify-between">
          {!user?.isVendor && <MakeVendorAccountButton />}
          {vendor?.stripeAccountId && !vendor?.isSubscribed && (
            <div className="mr-2">
              <VendorSubscriptionButton />
            </div>
          )}
          <Link
            href="/"
            className={
              "flex-grow rounded-md bg-black px-4 py-2 text-center text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 " +
              buttonClassNames
            }
          >
            Home
          </Link>
        </div>
      </div>
      <div className="flex-col">
        <ProfileDisplay
          name={user?.name ?? ""}
          email={user?.email ?? ""}
          city={user?.city ?? ""}
          state={user?.state ?? ""}
          postalCode={user?.postalCode ?? ""}
          imageUrl={user?.image ?? ""}
        />
        <PictureUpload
          isUserProfile={true}
        />
      </div>
    </div>
  );
};

export default Profile;
