import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '../store/store';
import { api } from 'zicarus/utils/api';
import type { User } from '@/types/user';

export function useUser() {
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const {
    data: user,
    isLoading,
    error,
  } = api.profile.getUserByID.useQuery(
    {
      userId: userId ?? '', 
    },
    {
      enabled: !!userId, 
    },
  );

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user as User);
  }, [user, setUser]);

  return { user, isLoading, error };
}