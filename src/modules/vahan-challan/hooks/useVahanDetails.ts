"use client";

import { useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  CONFIDENTIAL_VAHAN_DATA_QUERY,
  DELETE_VAHAN_DETAILS_MUTATION,
  VAHAN_JSON_QUERY,
} from "@/graphql/documents/vahan-challan";
import { REGISTRATION_NUMBER_PATTERN } from "@/modules/vahan-challan/constants";
import type {
  ConfidentialVahanDataResult,
  ProvahanVehicleData,
  VahanJsonResult,
} from "@/modules/vahan-challan/types";

export function useVahanDetails() {
  const [vehicleData, setVehicleData] = useState<ProvahanVehicleData | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState("");

  const [fetchVahan, { loading }] = useLazyQuery<VahanJsonResult>(
    VAHAN_JSON_QUERY,
    { fetchPolicy: "network-only" }
  );

  const [fetchConfidential] = useLazyQuery<ConfidentialVahanDataResult>(
    CONFIDENTIAL_VAHAN_DATA_QUERY,
    { fetchPolicy: "network-only" }
  );

  const [deleteVahan, { loading: deleteLoading }] = useMutation(
    DELETE_VAHAN_DETAILS_MUTATION
  );

  const searchVehicle = async (regNumber: string) => {
    const formatted = regNumber.replace(/\s+/g, "").toUpperCase();

    setErrorMsg("");
    setVehicleData(null);

    if (!formatted) {
      setErrorMsg("Please enter a registration number.");
      return;
    }

    if (!REGISTRATION_NUMBER_PATTERN.test(formatted)) {
      setErrorMsg("Invalid registration number.");
      return;
    }

    try {
      const { data } = await fetchVahan({
        variables: { where: { id_number: formatted } },
      });

      const result = data?.getParivahanDataJson?.provahanData;

      if (!result) {
        setErrorMsg("Invalid or empty response from Parivahan API.");
        return;
      }

      setVehicleData(result);
    } catch {
      setErrorMsg("Something went wrong while fetching vehicle details.");
    }
  };

  const deleteOldVahan = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete Vahan details older than 3 months.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteVahan();
      await Swal.fire("Deleted", "Old records removed", "success");
    } catch {
      await Swal.fire("Failed", "Could not delete old Vahan details.", "error");
    }
  };

  const getConfidentialData = async (regNumber: string) => {
    const { data } = await fetchConfidential({
      variables: { where: { id_number: regNumber } },
    });

    return data?.getAllParivahanDataJson?.provahanData ?? null;
  };

  return {
    vehicleData,
    loading,
    deleteLoading,
    errorMsg,
    searchVehicle,
    deleteOldVahan,
    getConfidentialData,
  };
}
