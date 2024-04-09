import { useState } from 'react';
import { api } from 'zicarus/utils/api'; // Adjust the import path based on your setup

interface usePaymentProps {
  bookingId: number;
}
export const usePayment = ({bookingId}:usePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: payForProductMutation } = api.stripe.payForProductWithPriceID.useMutation();


  //successUrl: string, cancelUrl: string
  const initiatePayment = async (priceId: string, stripeAccountId: string ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await payForProductMutation({
        priceId,
        stripeAccountId,
        bookingId
        // successUrl,
        // cancelUrl,
      });

      if (response.url) {
        window.open(response.url);
      } else {
        console.error('Payment session URL not provided.');
        setError('Failed to initiate payment session.');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setError('Error initiating payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { initiatePayment, isLoading, error };
};