import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useUserDetails } from "zicarus/hooks/useUserDetails";
import { User } from "zicarus/types/user";

const TopRightNav = () => {
  const { userDetails, isLoading } = useUserDetails();
  const { data: session } = useSession();

  // Early return to wait for user details to be loaded.
  if (isLoading || !userDetails) return null;

  const profileLink = `/profile/${session?.user?.id}`;
  const vendorLink = `/vendorDash/${session?.user?.id}`;
  const bookingsLink = `/bookings/${session?.user?.id}`;

  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed right-0 top-0 flex items-center space-x-4 p-4">
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        {session?.user.id.length && (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink
                href={profileLink}
                className={navigationMenuTriggerStyle()}
              >
                Profile
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href={bookingsLink}
                className={navigationMenuTriggerStyle()}
              >
                Bookings
              </NavigationMenuLink>
            </NavigationMenuItem>

            {(userDetails as User).isVendor && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={vendorLink}
                    className={navigationMenuTriggerStyle()}
                  >
                    Vendor Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={vendorLink + "/calendar"}
                    className={navigationMenuTriggerStyle()}
                  >
                    Calendar
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default TopRightNav;
