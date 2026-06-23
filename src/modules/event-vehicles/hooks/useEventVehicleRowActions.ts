"use client";

import { useCallback, useState } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  CREATE_VEHICLE_STATUS_MUTATION,
  DELETE_VEHICLE_MUTATION,
  UPDATE_VEHICLE_DATE_MUTATION,
} from "@/graphql/documents/vehicles";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { EventVehicleListItem } from "@/modules/event-vehicles/types";

export type BidTimeUpdateTarget = "startTime" | "endtime";

export interface BidTimeUpdateState {
  date: string;
  id: string;
  updateItem: BidTimeUpdateTarget;
}

export function useEventVehicleRowActions(onUpdated: () => void) {
  const [deleteVehicle] = useMutation(DELETE_VEHICLE_MUTATION);
  const [updateVehicleDate] = useMutation(UPDATE_VEHICLE_DATE_MUTATION);
  const [createVehicleStatus] = useMutation(CREATE_VEHICLE_STATUS_MUTATION);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusVehicleId, setStatusVehicleId] = useState("");
  const [statusVehicleBidStatus, setStatusVehicleBidStatus] = useState("");
  const [bidTimeUpdate, setBidTimeUpdate] = useState<BidTimeUpdateState | null>(
    null
  );

  const handleDelete = useCallback(
    async (vehicle: EventVehicleListItem) => {
      const result = await Swal.fire({
        title: "Are you sure you want to delete this vehicle?",
        html: `Registration no: ${vehicle.registrationNumber || ""}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Delete Vehicle",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      if ((vehicle.totalBids ?? 0) !== 0) {
        await Swal.fire({
          icon: "warning",
          title: "This vehicle has bid records",
          confirmButtonText: "OK",
        });
        return;
      }

      try {
        await deleteVehicle({ variables: { where: { id: vehicle.id } } });
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Vehicle deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onUpdated();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [deleteVehicle, onUpdated]
  );

  const handleAboutBid = useCallback(async (vehicle: EventVehicleListItem) => {
    await Swal.fire({
      html: `<div style="text-align:left">
        <h2 style="font-weight:600;margin-bottom:8px">Current Top Bidder</h2>
        <p>Name: ${vehicle.currentBidUser?.firstName ?? ""} ${vehicle.currentBidUser?.lastName ?? ""}</p>
        <p>Vehicle Number: ${vehicle.registrationNumber ?? ""}</p>
        <p>Bid Amount: ${vehicle.currentBidAmount ?? ""}</p>
      </div>`,
    });
  }, []);

  const openChangeStatus = useCallback(
    (vehicleId: string, bidStatus: string) => {
      setStatusVehicleId(vehicleId);
      setStatusVehicleBidStatus(bidStatus);
      setStatusModalOpen(true);
    },
    []
  );

  const handleChangeStatus = useCallback(
    async (vehicleId: string, status: string) => {
      const confirmed = await Swal.fire({
        title: "Save Changes Confirmation",
        html: "Are you sure you want to update the vehicle status?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, save it!",
        cancelButtonText: "No, cancel!",
      });

      if (!confirmed.isConfirmed) return;

      try {
        await createVehicleStatus({
          variables: {
            vehicleId,
            createVehicleStatusInput: { status },
          },
        });
        setStatusModalOpen(false);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Vehicle status updated!",
          timer: 2000,
          showConfirmButton: false,
        });
        onUpdated();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [createVehicleStatus, onUpdated]
  );

  const handleBidTimeUpdate = useCallback(
    async (isoDate: string) => {
      if (!bidTimeUpdate) return;

      const updateVehicleInput =
        bidTimeUpdate.updateItem === "startTime"
          ? { bidStartTime: isoDate }
          : { bidTimeExpire: isoDate };

      try {
        await updateVehicleDate({
          variables: {
            where: { id: bidTimeUpdate.id },
            updateVehicleInput,
          },
        });
        setBidTimeUpdate(null);
        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Bid time updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onUpdated();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [bidTimeUpdate, onUpdated, updateVehicleDate]
  );

  return {
    handleDelete,
    handleAboutBid,
    openChangeStatus,
    handleChangeStatus,
    handleBidTimeUpdate,
    statusModalOpen,
    setStatusModalOpen,
    statusVehicleId,
    statusVehicleBidStatus,
    bidTimeUpdate,
    setBidTimeUpdate,
  };
}
