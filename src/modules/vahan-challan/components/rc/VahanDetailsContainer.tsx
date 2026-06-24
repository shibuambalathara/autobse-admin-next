"use client";

import { useState } from "react";
import { LoadingState } from "@/components/feedback";
import { useVahanDetails } from "@/modules/vahan-challan/hooks/useVahanDetails";
import { VahanActions } from "@/modules/vahan-challan/components/rc/VahanActions";
import { VahanDetailsUI } from "@/modules/vahan-challan/components/rc/VahanDetailsUI";
import { VahanSearch } from "@/modules/vahan-challan/components/rc/VahanSearch";
import { downloadElementAsJpeg } from "@/modules/vahan-challan/utils/download-jpeg";

export function VahanDetailsContainer() {
  const [regNumber, setRegNumber] = useState("");

  const {
    vehicleData,
    loading,
    deleteLoading,
    errorMsg,
    searchVehicle,
    deleteOldVahan,
    getConfidentialData,
  } = useVahanDetails();

  return (
    <div className="rounded-lg border border-surface-border bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-center text-xl font-semibold text-red-600">
        RC Details
      </h2>

      <VahanActions
        regNumber={regNumber}
        vehicleData={vehicleData}
        deleteLoading={deleteLoading}
        onDelete={deleteOldVahan}
        onJpeg={() =>
          downloadElementAsJpeg(
            "vahan-details-section",
            `Vehicle_${regNumber}.jpeg`
          )
        }
        getConfidentialData={getConfidentialData}
      />

      <VahanSearch
        value={regNumber}
        onChange={setRegNumber}
        onSearch={() => searchVehicle(regNumber)}
        loading={loading}
      />

      {loading && <LoadingState label="Fetching RC details…" />}

      {errorMsg ? (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          {errorMsg}
        </p>
      ) : null}

      <VahanDetailsUI vehicleData={vehicleData} />
    </div>
  );
}
