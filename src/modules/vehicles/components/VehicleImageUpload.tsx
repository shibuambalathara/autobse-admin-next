"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui";
import { uploadVehicleImages } from "@/modules/vehicles/utils/vehicle-api";

interface VehicleImageUploadProps {
  isEditable: boolean;
  loanAgreementNo: string;
  registrationNumber: string;
}

export function VehicleImageUpload({
  isEditable,
  loanAgreementNo,
  registrationNumber,
}: VehicleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (files.length === 0) {
      await Swal.fire({ icon: "warning", title: "No files", text: "Select at least one image." });
      return;
    }
    setUploading(true);
    try {
      await uploadVehicleImages(loanAgreementNo, registrationNumber, files);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      await Swal.fire({
        icon: "success",
        title: "Uploaded",
        text: "Images uploaded successfully.",
        timer: 2000,
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
    <div className="col-span-full space-y-3 rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold">Upload Images</h3>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={!isEditable}
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
      />
      {files.length > 0 && isEditable && (
        <Button type="button" size="sm" disabled={uploading} onClick={handleUpload}>
          {uploading ? "Uploading…" : `Upload ${files.length} image(s)`}
        </Button>
      )}
    </div>
  );
}
