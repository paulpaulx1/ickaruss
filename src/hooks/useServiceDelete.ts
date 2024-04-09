// hooks/useServiceDelete.ts
import { useToast } from 'zicarus/components/ui/use-toast';
import { api } from '../utils/api'; // Ensure this path matches where you've defined your `api`

export const useServiceDelete = ({vendorId}: {vendorId: string}) => {
    const utils = api.useUtils();
    const { toast } = useToast();
    const deleteServiceMutation = api.vendor.deleteService.useMutation({
    onSuccess: async () => {
      await utils.vendor.getServicesByVendorId.invalidate({vendorId})
    },
  });

  const deleteService = async (stripeProductId: string, vendorId: string) => {
    try {
      await deleteServiceMutation.mutateAsync({ stripeProductId });
      toast({ description: 'Service deleted successfully', title: 'Success' });
  
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({ description: 'Error deleting service', title: 'Error', variant: 'destructive'});
    }
  };

  return {
    deleteService,
    isLoading: deleteServiceMutation.isLoading,
    isError: deleteServiceMutation.isError,
    error: deleteServiceMutation.error,
  };
};