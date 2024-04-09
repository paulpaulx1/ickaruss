import { api } from 'zicarus/utils/api';
import { useSession } from 'next-auth/react';

export function useUpdateUserProfileImage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // tRPC mutation hook for updating user's profile image
  const mutation = api.profile.updateUserImage.useMutation();

  const updateUserImage = async (newImageUrl: string) => {
    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    try {
      // Call the tRPC mutation with the new image URL
      await mutation.mutateAsync({ imageUrl: newImageUrl });
      console.log('User profile image updated successfully');
      return newImageUrl;
    } catch (error) {
      console.error('Failed to update user profile image', error);
    }
  };

  return {
    updateUserImage,
    isUpdating: mutation.isLoading,
    error: mutation.error,
  };
}