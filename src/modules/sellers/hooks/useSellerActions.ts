"use client";

import { useCallback, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { SELLER_ACR_BY_END_DATE_QUERY } from "@/graphql/documents/sellers";
import { extractGraphqlError } from "@/lib/graphql-errors";
import type { SellerAcrByEndDateResult } from "@/modules/sellers/types";
import { exportSellerAcrReport } from "@/modules/sellers/utils/seller-acr";

async function promptEndDate(): Promise<string | null> {
  const { value, isConfirmed } = await Swal.fire({
    title: "Select End Date",
    html: `
      <input id="seller-acr-end-date" type="date" class="swal2-input" style="width: auto;" />
      <div id="seller-acr-date-error" style="color: red; font-size: 13px; margin-top: 4px; display: none;">
        End date is required
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Download ACR",
    preConfirm: () => {
      const input = document.getElementById(
        "seller-acr-end-date"
      ) as HTMLInputElement | null;
      const value = input?.value ?? "";
      const errorEl = document.getElementById("seller-acr-date-error");

      if (!value) {
        if (errorEl) errorEl.style.display = "block";
        return false;
      }
      if (errorEl) errorEl.style.display = "none";
      return value;
    },
  });

  if (!isConfirmed || !value) return null;
  return value;
}

export function useSellerActions() {
  const [fetchAcrByEndDate, { loading: acrLoading }] =
    useLazyQuery<SellerAcrByEndDateResult>(SELLER_ACR_BY_END_DATE_QUERY, {
      fetchPolicy: "network-only",
    });

  const downloadAcr = useCallback(
    async (sellerId: string, sellerName: string) => {
      const endDate = await promptEndDate();
      if (!endDate) return;

      try {
        const { data } = await fetchAcrByEndDate({
          variables: {
            where: {
              sellerId,
              endDate,
            },
          },
        });

        const acrData = data?.getAcrBySellerAndEndDate;
        const exported = exportSellerAcrReport(acrData, sellerName);

        if (!exported) {
          await Swal.fire({
            icon: "warning",
            title: "No ACR data found",
            text: "No records were returned for the selected end date.",
          });
          return;
        }

        await Swal.fire({
          icon: "success",
          title: "Downloaded",
          text: "ACR report exported successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error: unknown) {
        const { message } = extractGraphqlError(error);
        await Swal.fire({
          icon: "error",
          title: "Download failed",
          text: message,
        });
      }
    },
    [fetchAcrByEndDate]
  );

  return useMemo(
    () => ({
      downloadAcr,
      acrLoading,
    }),
    [downloadAcr, acrLoading]
  );
}
