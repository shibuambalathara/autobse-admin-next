"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import Swal from "sweetalert2";
import { DELETE_CAREER_MUTATION } from "@/graphql/documents/careers";
import type { Career } from "@/modules/career/types";

export function useCareerRowActions(onChanged: () => void) {
  const [deleteCareer] = useMutation(DELETE_CAREER_MUTATION);

  const handleDelete = useCallback(
    async (career: Career) => {
      const result = await Swal.fire({
        title: "Delete this career?",
        html: `Designation: ${career.title ?? "—"}<br/>Location: ${career.location ?? "—"}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      try {
        await deleteCareer({ variables: { where: { id: career.id } } });
        onChanged();
        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Career deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to delete career.";
        await Swal.fire({ icon: "error", title: "Failed", text: message });
      }
    },
    [deleteCareer, onChanged]
  );

  return { handleDelete };
}
