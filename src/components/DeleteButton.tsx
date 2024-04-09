// components/DeleteButton.tsx
import React from 'react';
import { useServiceDelete } from '../hooks/useServiceDelete'; // Adjust the import path as needed
import { Button } from './ui/button';
interface DeleteButtonProps {
  stripeProductId: string;
  vendorId: string; 
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ stripeProductId, vendorId }) => {
  const { deleteService, isLoading } = useServiceDelete({vendorId}); 

  const handleDelete = async () => {
    if (isLoading) return;
    await deleteService(stripeProductId, vendorId);
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? 'Deleting...' : 'Delete'}
    </Button>
  );
};

export default DeleteButton;