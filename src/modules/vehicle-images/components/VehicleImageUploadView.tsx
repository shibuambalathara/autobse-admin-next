"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Button, Input } from "@/components/ui";
import { VehicleImageSearchFields } from "@/modules/vehicle-images/components/VehicleImageSearchFields";
import { uploadVehicleImages } from "@/modules/vehicles/utils/vehicle-api";

export function VehicleImageUploadView() {
  const [loanAgreementNo, setLoanAgreementNo] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!files.length) {
      await Swal.fire({
        icon: "warning",
        title: "No files",
        text: "Please select at least one image.",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadVehicleImages(loanAgreementNo, registrationNumber, files);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Images uploaded successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <VehicleImageSearchFields
        loanAgreementNo={loanAgreementNo}
        registrationNumber={registrationNumber}
        onLoanChange={setLoanAgreementNo}
        onRegChange={setRegistrationNumber}
      />

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-800 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
      />

      {files.length > 0 && (
        <div className="text-sm text-brand-700">
          <p className="font-medium">Selected files ({files.length})</p>
          <ul className="mt-1 list-disc pl-5">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="button"
        onClick={handleUpload}
        isLoading={uploading}
        loadingText="Uploading…"
      >
        Upload
      </Button>
    </div>
  );
}
