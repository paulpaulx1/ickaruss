import { useRef } from "react";
import { useUpdateUserProfileImage } from "zicarus/hooks/useProfileImage"; // Adjust the path as necessary
import { compressImage } from "zicarus/utils/compress"; // Make sure the path matches your project structure
import { useUserStore, useVendorStore } from "../store/store"; // Ensure this is the correct path
import type { UploadResponse } from "zicarus/types/upload";
import { Button } from "./ui/button";
import { is } from "drizzle-orm";
import { useUploadVendorImage } from "zicarus/hooks/useUploadVendorImage";
import { stat } from "fs";
import { Vendor } from "zicarus/types/vendor";

interface PictureUploadProps {
  isUserProfile: boolean;
}

const PictureUpload: React.FC<PictureUploadProps> = ({ isUserProfile }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { updateUserImage } = useUpdateUserProfileImage();
  const { updateVendorImage } = useUploadVendorImage();

  const updateUser = useUserStore((state) => state.updateUser);
  const updateVendor = useVendorStore((state) => state.updateVendor);

  const uploadFile = async (originalFile: File) => {
    const compressedBlob = await compressImage(originalFile);

    const compressedFile = new File([compressedBlob], originalFile.name, {
      type: compressedBlob.type,
      lastModified: originalFile.lastModified,
    });

    try {
      const response = await fetch(
        `/api/picture/upload?filename=${compressedFile.name}`,
        {
          method: "POST",
          body: compressedFile,
        },
      );
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const newBlob: UploadResponse = (await response.json()) as UploadResponse;
      if (isUserProfile) {
        await updateUserImage(newBlob.url);
        updateUser({ image: newBlob.url });
      } else {
        await updateVendorImage(newBlob.url);
        updateVendor({ image: newBlob.url } as Partial<Vendor>);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md flex-col items-center justify-center rounded-lg bg-white p-4 shadow-md">
      <h1 className="text-lg font-semibold text-gray-800">
        {isUserProfile ? "Upload Your Avatar" : "Upload a Picture"}
      </h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (inputFileRef.current?.files?.[0]) {
            const file = inputFileRef.current.files[0];
            uploadFile(file)
              .then(() => {
                console.log("File uploaded successfully");
              })
              .catch((error) => {
                console.error("File upload failed:", error);
              });
          }
        }}
        className="mt-4"
      >
        <input
          name="file"
          ref={inputFileRef}
          type="file"
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
        />
        <Button className="mt-4 w-full" type="submit">
          Upload
        </Button>
      </form>
    </div>
  );
};

export default PictureUpload;
