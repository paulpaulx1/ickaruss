import React from 'react';
import { usePayment } from '@/hooks/usePayment'; // Adjust the import path based on your setup
import { useToast } from '@/components/ui/use-toast'; // Assuming you have a custom hook for toasts
import { Button } from './ui/button';
// import { useBookingStore } from './useBookingStore'; // Adjust the import path based on your setup

interface PayButtonProps {
  priceId: string;
  stripeAccountId: string;
  bookingId: number; // Assuming each payment is associated with a specific booking
//   successUrl: string;
//   cancelUrl: string;
}

//bookingId, successUrl, cancelUrl
const PayButton: React.FC<PayButtonProps> = ({ priceId, stripeAccountId, bookingId }) => {
  const { initiatePayment, isLoading, error } = usePayment({bookingId});
//   const { setBookingDepositPaid } = useBookingStore();
  const { toast } = useToast(); // Custom hook to show toast notifications

  const handlePaymentClick = async () => {
    try {
        //successUrl, cancelUrl
      await initiatePayment(priceId, stripeAccountId);

      // Assuming the payment was successful, you'd likely check this with a more robust system
      // Update the booking's deposit status in the store
    //   setBookingDepositPaid(bookingId);

      // Show success toast
      toast({ title: 'Payment initiated', description: 'You will be redirected to complete the payment.'});
    } catch (err) {
      console.error('Payment initiation error:', error);
      // Optionally, show error toast if needed
      toast({ title: 'Error', description: 'Failed to initiate payment. Please try again.'});
    }
  };

  return (
    <Button onClick={handlePaymentClick} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay Now'}
    </Button>
  );
};

export default PayButton;