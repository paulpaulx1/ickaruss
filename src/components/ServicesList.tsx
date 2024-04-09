import React from "react";
import DeleteButton from "./DeleteButton";
import { useVendorStore } from "zicarus/store/store";
import { Service } from "zicarus/types/service";
import { Vendor } from "zicarus/types/vendor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router"; // Import useRouter
import { RouterOutputs, api } from "zicarus/utils/api";

interface ServicesListProps {
  vendor: Vendor;
}

const ServicesList: React.FC<ServicesListProps> = ({ vendor }) => {
  const { data: session } = useSession();
  const router = useRouter(); // Use the useRouter hook to access the router object
  const { data: services } = api.vendor.getServicesByVendorId.useQuery(
    { vendorId: vendor?.id ?? "" },
    { enabled: !!vendor?.id }
  );
  const showDeleteButton =
    router.pathname.includes("vendorDash") && session?.user?.id === vendor?.userId;

  if (!services || services.length === 0) return <div>No services found.</div>;

  return (
    <ul className="divide-y divide-gray-200">
      {services?.map((service: Service) => (
        <li key={String(service.id)} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold">{service.serviceName}</span>
              <span className="text-gray-500">
                {service.serviceDescription}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-semibold">${service.price}</span>
              <span className="text-gray-500">{service.currency}</span>
            </div>
          </div>
          {showDeleteButton && (
            <DeleteButton
              vendorId={vendor?.id ?? ""}
              stripeProductId={service.stripeProductId ? service.stripeProductId : ""}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ServicesList;
