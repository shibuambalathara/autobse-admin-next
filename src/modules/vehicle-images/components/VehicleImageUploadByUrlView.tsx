"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui";
import { FormField } from "@/components/forms";
import { VehicleImageSearchFields } from "@/modules/vehicle-images/components/VehicleImageSearchFields";
import { uploadVehicleImagesByUrl } from "@/modules/vehicles/utils/vehicle-api";

export function VehicleImageUploadByUrlView() {
  const [loanAgreementNo, setLoanAgreementNo] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!imageUrls.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter image URL.",
      });
      return;
    }

    setUploading(true);
    try {
      await uploadVehicleImagesByUrl(
        loanAgreementNo,
        registrationNumber,
        imageUrls
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Image uploaded via URL successfully.",
        timer: 2500,
        showConfirmButton: false,
      });

      setImageUrls("");
      setLoanAgreementNo("");
      setRegistrationNumber("");
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload image from URL.",
      });
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

      <FormField label="Image URL" htmlFor="vehicle-image-url-upload">
        <textarea
          id="vehicle-image-url-upload"
          rows={4}
          placeholder="Paste vehicle image URL here…"
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          className="w-full max-w-3xl rounded-md border border-surface-border p-3 text-sm shadow-sm"
        />
      </FormField>

      <Button
        type="button"
        onClick={handleUpload}
        isLoading={uploading}
        loadingText="Uploading…"
      >
        URL Direct Upload
      </Button>
    </div>
  );
}
