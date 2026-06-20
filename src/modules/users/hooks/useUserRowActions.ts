"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  DELETE_USER_MUTATION,
  MOVE_USER_TO_POTENTIAL_CLIENT_MUTATION,
} from "@/graphql/documents/users";
import {
  buildRegistrationExpiryMessage,
  formatStateDisplay,
} from "@/modules/users/utils";
import { sendRegistrationExpiryWhatsapp } from "@/modules/users/utils/user-api";
import { formatDateOnly } from "@/lib/date-format";
import type { UserListItem } from "@/modules/users/types";
import Swal from "sweetalert2";

export function useUserRowActions(onRefetch: () => void) {
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const [moveToPotentialClient] = useMutation(
    MOVE_USER_TO_POTENTIAL_CLIENT_MUTATION
  );
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const handleDelete = async (user: UserListItem) => {
    const response = await Swal.fire({
      title: "Are you sure you want to delete this user?",
      html: `
        User Name: ${user.firstName} ${user.lastName || ""}<br>
        Role: ${user.role}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Delete User",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!response.isConfirmed) return;

    try {
      await deleteUser({ variables: { where: { id: user.id } } });
      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      await onRefetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Not allowed to perform this action.";
      await Swal.fire({
        icon: "error",
        title: "Permission Denied",
        text: message,
      });
    }
  };

  const handleMoveToCrm = async (user: UserListItem) => {
    const response = await Swal.fire({
      title: "Move this user to Potential Buyers?",
      html: `
        User No: ${user.idNo}<br>
        Name: ${user.firstName || ""} ${user.lastName || ""}<br>
        Mobile: ${user.mobile || "—"}
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Move",
      cancelButtonText: "Cancel",
    });

    if (!response.isConfirmed) return;

    try {
      const res = await moveToPotentialClient({
        variables: { where: { id: user.id } },
      });
      if (res?.data?.moveUserToPotentialClient?.id) {
        await Swal.fire({
          icon: "success",
          title: "Moved",
          text: "User moved to potential buyers.",
          timer: 2000,
          showConfirmButton: false,
        });
        await onRefetch();
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to move client";
      await Swal.fire({ icon: "error", title: "Error", text: message });
    }
  };

  const handleSendExpiryWhatsapp = async (user: UserListItem) => {
    if (!user.registrationExpiryDate) {
      await Swal.fire(
        "Missing Date",
        "This user has no registration expiry date set.",
        "warning"
      );
      return;
    }

    const expiryFormatted = formatDateOnly(user.registrationExpiryDate);

    const result = await Swal.fire({
      title: "Send Registration Expiry WhatsApp",
      html: `
        <pre id="expiry-whatsapp-preview" style="text-align:left;white-space:pre-wrap;font-size:13px;margin:0 0 12px;"></pre>
        <label for="expiry-whatsapp-contact" style="display:block;text-align:left;font-size:14px;margin-bottom:4px;">
          Contact name and number
        </label>
        <input id="expiry-whatsapp-contact" type="text" class="swal2-input" style="margin:0;" value="" />
      `,
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      didOpen: () => {
        const previewEl = document.getElementById("expiry-whatsapp-preview");
        const contactInput = document.getElementById(
          "expiry-whatsapp-contact"
        ) as HTMLInputElement | null;
        if (!previewEl || !contactInput) return;

        const updatePreview = () => {
          previewEl.textContent = buildRegistrationExpiryMessage(
            user.firstName,
            expiryFormatted,
            contactInput.value
          );
        };
        contactInput.addEventListener("input", updatePreview);
        updatePreview();
      },
      preConfirm: () => {
        const contact = (
          document.getElementById("expiry-whatsapp-contact") as HTMLInputElement
        )?.value?.trim();
        if (!contact) {
          Swal.showValidationMessage("Contact name and number is required");
          return false;
        }
        return contact;
      },
    });

    if (!result.isConfirmed || !result.value) return;

    setLoadingUserId(user.id);
    try {
      await sendRegistrationExpiryWhatsapp(user.id, String(result.value));
      await Swal.fire({
        icon: "success",
        title: "Sent",
        text: "Registration expiry WhatsApp sent successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      await Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoadingUserId(null);
    }
  };

  return {
    handleDelete,
    handleMoveToCrm,
    handleSendExpiryWhatsapp,
    loadingUserId,
  };
}

export function mapUsersForDisplay<T extends { state?: string | null }>(
  users: T[]
): T[] {
  return users.map((user) => ({
    ...user,
    state: user.state ? formatStateDisplay(user.state) : user.state,
  }));
}
