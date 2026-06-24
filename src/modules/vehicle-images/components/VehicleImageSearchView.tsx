"use client";

import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import Swal from "sweetalert2";
import { Button } from "@/components/ui";
import { LoadingState } from "@/components/feedback";
import { VEHICLE_IMAGES_QUERY } from "@/graphql/documents/vehicle-images";
import { VehicleImageSearchFields } from "@/modules/vehicle-images/components/VehicleImageSearchFields";
import {
  extractVehicleImageUrls,
  type VehicleImagesResult,
} from "@/modules/vehicle-images/types";
import { VehicleImageGallery } from "@/modules/vehicles/components/VehicleImageGallery";
import { updateVehicleImageUrls } from "@/modules/vehicles/utils/vehicle-api";

export function VehicleImageSearchView() {
  const [loanAgreementNo, setLoanAgreementNo] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUrls, setEditedUrls] = useState("");
  const [saving, setSaving] = useState(false);

  const [fetchImages, { data, loading, error, refetch }] =
    useLazyQuery<VehicleImagesResult>(VEHICLE_IMAGES_QUERY, {
      fetchPolicy: "network-only",
    });

  const isValidSearch =
    loanAgreementNo.trim() !== "" || registrationNumber.trim() !== "";
  const isValidEdit =
    loanAgreementNo.trim() !== "" && registrationNumber.trim() !== "";

  const imageUrls = useMemo(
    () => extractVehicleImageUrls(data?.getAllVehicleImages?.vehicleImages),
    [data]
  );

  useEffect(() => {
    if (!isEditing && imageUrls.length > 0) {
      setEditedUrls(imageUrls.join("\n"));
    }
  }, [imageUrls, isEditing]);

  const handleSearch = async () => {
    if (!isValidSearch) {
      setErrorMsg("Please enter Loan Agreement Number or Registration Number.");
      return;
    }

    setErrorMsg("");
    setIsEditing(false);

    await fetchImages({
      variables: {
        where: {
          loanAgreementNo: loanAgreementNo || undefined,
          registrationNumber: registrationNumber || undefined,
        },
      },
    });
  };

  const handleEdit = () => {
    if (!isValidEdit) {
      void Swal.fire({
        icon: "error",
        title: "Error",
        text: "Loan Agreement No and Registration Number are required.",
      });
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isValidEdit) {
      void Swal.fire({
        icon: "error",
        title: "Error",
        text: "Both Loan Agreement No and Registration Number are required.",
      });
      return;
    }

    setSaving(true);
    try {
      const urlsArray = editedUrls
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      await updateVehicleImageUrls(
        loanAgreementNo,
        registrationNumber,
        urlsArray
      );

      await Swal.fire({
        icon: "success",
        title: "Updated",
        text: "Vehicle image URLs updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setIsEditing(false);
      await refetch?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed.";
      await Swal.fire({ icon: "warning", title: "Failed", text: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <VehicleImageSearchFields
        loanAgreementNo={loanAgreementNo}
        registrationNumber={registrationNumber}
        onLoanChange={setLoanAgreementNo}
        onRegChange={setRegistrationNumber}
      />

      <Button type="button" onClick={handleSearch} disabled={!isValidSearch}>
        Search
      </Button>

      {errorMsg ? (
        <p className="text-sm font-medium text-red-600">{errorMsg}</p>
      ) : null}
      {error ? (
        <p className="text-sm font-medium text-red-600">{error.message}</p>
      ) : null}
      {loading ? <LoadingState label="Loading vehicle images…" /> : null}

      {imageUrls.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-brand-900">
            Vehicle Images
            {loanAgreementNo ? ` - ${loanAgreementNo}` : ""}
            {registrationNumber ? ` / ${registrationNumber}` : ""}
          </h3>

          <VehicleImageGallery
            images={imageUrls}
            loanAgreementNo={loanAgreementNo}
            registrationNumber={registrationNumber}
          />

          <div className="space-y-3">
            <label
              htmlFor="vehicle-image-urls"
              className="block text-sm font-semibold text-brand-900"
            >
              Vehicle Image URLs
            </label>
            <textarea
              id="vehicle-image-urls"
              rows={6}
              value={editedUrls}
              onChange={(e) => setEditedUrls(e.target.value)}
              readOnly={!isEditing}
              className={`w-full max-w-3xl rounded-md border p-3 text-sm shadow-sm ${
                isEditing
                  ? "border-brand-500 bg-white"
                  : "border-surface-border bg-surface-muted"
              }`}
            />

            <div className="flex flex-wrap gap-2">
              {!isEditing ? (
                <Button type="button" variant="secondary" onClick={handleEdit}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleSave}
                    isLoading={saving}
                    loadingText="Saving…"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUrls(imageUrls.join("\n"));
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
