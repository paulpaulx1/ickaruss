import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "../utils/supabase";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null; // Assuming this is a date, adjust the type if necessary
  image: string;
  city: string;
  isVendor: boolean;
  postalCode: string;
  state: string;
  // Add other fields as necessary
}

export const useUserDetails = () => {
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session) {
        setIsLoading(true);
        try {
          const { data }  = await supabase
            .from("zicuras_user")
            .select()
            .eq("id", session.user.id)
            .single() as { data: UserDetails };
            
          setUserDetails(data ?? null); 
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserDetails().catch(console.error);
  }, [session]);
  console.log(userDetails);
  return { userDetails, session, isLoading };
};
