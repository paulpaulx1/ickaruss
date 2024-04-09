import React from "react";
import Image from 'next/image'

interface ProfileDisplayProps {
  name: string;
  city: string;
  email: string;
  state: string;
  imageUrl: string;
  postalCode: string;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  name,
  city,
  state,
  email,
  postalCode,
  imageUrl
}) => {
  return (
    <div className="max-w-lg flex flex-col justify-center items-center rounded-lg bg-white p-8 shadow-md">
      <Image
        src={imageUrl}
        alt="Profile"
        width={120}
        height={120}
        className="mb-4 h-40 w-40 rounded object-cover"
      />
      <div className="text-center">
        <p className="mb-2 text-2xl font-bold">{name}</p>
        <p className="mb-1 text-lg">{email}</p>
        <p className="mb-1 text-lg">
          {city}, {state} {postalCode}
        </p>
      </div>
    </div>
  );
};

export default ProfileDisplay;
