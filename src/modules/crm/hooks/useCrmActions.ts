"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import {
  DELETE_CRM_MUTATION,
  MOVE_POTENTIAL_CLIENT_TO_USER_MUTATION,
  RESTORE_CRM_MUTATION,
} from "@/graphql/documents/crm";
import type { CrmClient, CrmDeletedClient } from "@/modules/crm/types";
import { extractGraphqlError } from "@/lib/graphql-errors";

export function useCrmActions(onSuccess?: () => void) {
  const [deletePotentialClient] = useMutation(DELETE_CRM_MUTATION);
  const [movePotentialClientToUser] = useMutation(
    MOVE_POTENTIAL_CLIENT_TO_USER_MUTATION
  );
  const [restoreClient] = useMutation(RESTORE_CRM_MUTATION);

  const deleteClient = useCallback(
    async (client: CrmClient) => {
      const response = await Swal.fire({
        title: "Are you sure you want to delete this buyer?",
        html: `
          SL No: ${client.idNo}<br>
          Name: ${[client.firstName, client.lastName].filter(Boolean).join(" ") || "—"}<br>
          Mobile: ${client.mobile}
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        confirmButtonText: "Delete buyer",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await deletePotentialClient({ variables: { where: { id: client.id } } });
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Potential buyer deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Error", text: message });
      }
    },
    [deletePotentialClient, onSuccess]
  );

  const moveToUser = useCallback(
    async (client: CrmClient) => {
      const response = await Swal.fire({
        title: "Move this potential buyer to Users?",
        html: `SL No: ${client.idNo}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Move",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await movePotentialClientToUser({
          variables: { where: { id: client.id } },
        });
        await Swal.fire({
          icon: "success",
          title: "Moved",
          text: "Potential buyer moved to users successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Error", text: message });
      }
    },
    [movePotentialClientToUser, onSuccess]
  );

  const restoreDeletedClient = useCallback(
    async (client: CrmDeletedClient) => {
      const response = await Swal.fire({
        title: "Are you sure you want to restore this client?",
        html: `
          Name: ${[client.firstName, client.lastName].filter(Boolean).join(" ") || "—"}<br>
          Mobile: ${client.mobile}
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Restore Client",
        cancelButtonText: "Cancel",
      });

      if (!response.isConfirmed) return;

      try {
        await restoreClient({ variables: { where: { id: client.id } } });
        await Swal.fire({
          icon: "success",
          title: "Restored",
          text: "Potential buyer restored successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess?.();
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({ icon: "error", title: "Error", text: message });
      }
    },
    [onSuccess, restoreClient]
  );

  return { deleteClient, moveToUser, restoreDeletedClient };
}
