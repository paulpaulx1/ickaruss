import React, { useEffect, useState } from "react";
import { useFetchVendorServices } from "@/hooks/useFetchVendorServices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Service } from "zicarus/types/service";

interface ServiceDropdownProps {
  vendorId: string;
  onSelect: (service: Service) => void;
}

const ServiceDropdown: React.FC<ServiceDropdownProps> = ({
  vendorId,
  onSelect,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { services, isLoading, error } = useFetchVendorServices(vendorId);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    onSelect(service);
  };

  return (
    <div className="m-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="btn rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            {selectedService ? selectedService.serviceName : "Select Service"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 rounded-md bg-white p-2 shadow-lg">
          {isLoading ? (
            <DropdownMenuItem disabled className="p-2 text-gray-500">
              Loading...
            </DropdownMenuItem>
          ) : error ? (
            <DropdownMenuItem disabled className="p-2 text-gray-500">
              Error loading services
            </DropdownMenuItem>
          ) : (
            services.map((service) => (
              <DropdownMenuItem
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="cursor-pointer rounded-md p-2 text-gray-700 hover:bg-blue-100"
              >
                {service.serviceName}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ServiceDropdown;
