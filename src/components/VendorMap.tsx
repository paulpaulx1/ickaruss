import { getSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { api } from "zicarus/utils/api";
import Image from 'next/image'

function VendorMap() {
  const session = getSession();
  const vendorsQuery = api.vendor.getAllVendors.useQuery();
  const { data: vendors } = vendorsQuery;

  useEffect(() => {
    vendorsQuery.refetch().catch(error => console.error(error));
  },[session]);

  return (
      <ul className="mt-4 grid gap-4 grid-cols-2 justify-center">
        {vendors?.map((vendor) => (
          <li
            key={vendor.id}
            className="block rounded-lg border border-gray-200 p-4 transition duration-300 hover:bg-gray-100"
          >
            <Link href={`/vendor/${vendor.id}`}>
              {vendor.image && <img src={vendor.image}
              alt={vendor.businessName ? vendor.businessName + " Logo" : "Business Logo"} />}
              <h2 className="text-lg font-semibold">{vendor.businessName}</h2>
              <p className="text-sm">{vendor.businessDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
  );
}

export default VendorMap;
