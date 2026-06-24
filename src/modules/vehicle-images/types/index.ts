export interface VehicleImageRecord {
  image?: string | null;
  loanAgreementNo?: string | null;
  registrationNumber?: string | null;
}

export interface VehicleImagesResult {
  getAllVehicleImages: {
    vehicleImages: VehicleImageRecord[];
  };
}

export interface VehicleImageWhereInput {
  loanAgreementNo?: string;
  registrationNumber?: string;
}

export type VehicleImagesView = "SEARCH" | "UPLOAD" | "UPLOAD_URL";

export function extractVehicleImageUrls(
  records: VehicleImageRecord[] | undefined
): string[] {
  return (
    records?.flatMap((item) =>
      item.image
        ? item.image
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean)
        : []
    ) ?? []
  );
}
