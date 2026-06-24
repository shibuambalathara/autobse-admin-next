"use client";

import Swal from "sweetalert2";
import { Button } from "@/components/ui";
import {
  downloadConfidentialRcPdf,
  downloadRcDetailsPdf,
} from "@/modules/vahan-challan/utils/rc-data-pdf";
import type { ProvahanVehicleData } from "@/modules/vahan-challan/types";

interface VahanActionsProps {
  regNumber: string;
  vehicleData: ProvahanVehicleData | null;
  deleteLoading: boolean;
  onDelete: () => void;
  onJpeg: () => void;
  getConfidentialData: (regNumber: string) => Promise<ProvahanVehicleData | null>;
}

export function VahanActions({
  regNumber,
  vehicleData,
  deleteLoading,
  onDelete,
  onJpeg,
  getConfidentialData,
}: VahanActionsProps) {
  const handleConfidentialPdf = async () => {
    if (!regNumber) {
      await Swal.fire("Warning", "Search vehicle first", "warning");
      return;
    }

    const confidential = await getConfidentialData(regNumber);

    if (!confidential) {
      await Swal.fire("Not Found", "Confidential data unavailable", "info");
      return;
    }

    downloadConfidentialRcPdf(regNumber, confidential);
    await Swal.fire("Downloaded", "Confidential PDF ready", "success");
  };

  const handlePdf = () => {
    if (!vehicleData || !regNumber) return;
    downloadRcDetailsPdf(regNumber, vehicleData);
  };

  return (
    <div className="mb-4 flex flex-wrap justify-end gap-2">
      <Button type="button" variant="secondary" onClick={handleConfidentialPdf}>
        Confidential PDF
      </Button>

      <Button
        type="button"
        onClick={handlePdf}
        disabled={!vehicleData}
      >
        Download PDF
      </Button>

      <Button type="button" variant="secondary" onClick={onJpeg}>
        Download JPEG
      </Button>

      <Button
        type="button"
        variant="danger"
        onClick={onDelete}
        isLoading={deleteLoading}
        loadingText="Deleting..."
      >
        Delete Vahan Details
      </Button>
    </div>
  );
}
