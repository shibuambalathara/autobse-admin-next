"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui";
import { downloadVehicleImage } from "@/modules/vehicles/utils/vehicle-api";

interface VehicleImageGalleryProps {
  images: string[];
  loanAgreementNo: string;
  registrationNumber: string;
}

export function VehicleImageGallery({
  images,
  loanAgreementNo,
  registrationNumber,
}: VehicleImageGalleryProps) {
  const [downloading, setDownloading] = useState<number | null>(null);

  if (images.length === 0) return null;

  const handleDownload = async (index: number) => {
    setDownloading(index);
    try {
      await downloadVehicleImage(index, loanAgreementNo, registrationNumber);
      await Swal.fire({
        icon: "success",
        title: "Downloaded",
        text: "Image downloaded successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Download failed.";
      await Swal.fire({ icon: "error", title: "Failed", text: message });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="col-span-full space-y-2">
      <h3 className="text-lg font-semibold">Vehicle Images</h3>
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative flex flex-col items-center gap-2 rounded-lg border border-border p-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url.trim()}
              alt={`Vehicle ${registrationNumber} image ${index + 1}`}
              className="h-24 w-32 rounded object-cover"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={downloading === index + 1}
              onClick={() => handleDownload(index + 1)}
            >
              <Download className="h-3 w-3" />
              {downloading === index + 1 ? "…" : "Download"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
