import React from "react";
import type { Vendor } from "@/types/vendor";
import ServicesList from "./ServicesList";
import { useSession } from "next-auth/react";
import InitiateConversation from "./InitiateConversation";

interface VendorDisplayProps {
  vendor: Vendor;
}

const VendorDisplay: React.FC<VendorDisplayProps> = ({ vendor }) => {
  const isVendorDash = vendor.userId === useSession().data?.user?.id;

  return (
    <>
      <div className="flex">
        <div className="max-w-lg flex-col rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-2 mt-8 text-3xl font-bold text-gray-900">
            {vendor.businessName}
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            {vendor.businessDescription}
          </p>
            {vendor.image && <img src={vendor.image} />}
          <h2 className="mb-4 text-2xl font-bold">Services</h2>
          {vendor.id ? (
            <ServicesList vendor={vendor} />
          ) : (
            <p>No services found.</p>
          )}
          {!isVendorDash && (
            <InitiateConversation vendorUserId={vendor.userId!} />
          )}
        </div>
      </div>
    </>
  );
};

export default VendorDisplay;
