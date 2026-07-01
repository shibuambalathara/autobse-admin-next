"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { FormField, FormGrid, Textarea } from "@/components/forms";
import { Button, FormCard, Input, PageContainer } from "@/components/ui";
import { EmptyState, LoadingState } from "@/components/feedback";
import { ARCHIVE_VEHICLE_DETAIL_QUERY } from "@/graphql/documents/archive-events";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { formatDate } from "@/lib/date-format";
import type { ArchiveVehicleDetailResult } from "@/modules/archive-events/types";
import { VehicleImageGallery } from "@/modules/vehicles/components/VehicleImageGallery";
import {
  formatImageTextareaValue,
  normalizeVehicleImages,
} from "@/modules/vehicles/utils/vehicle-payload";

interface ArchiveVehicleDetailViewProps {
  vehicleId: string;
  eventArchiveId?: string;
  eventNo?: string;
  sellerName?: string;
}

function displayValue(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  return String(value);
}

export function ArchiveVehicleDetailView({
  vehicleId,
  eventArchiveId,
  eventNo,
  sellerName,
}: ArchiveVehicleDetailViewProps) {
  const { data, loading, error, refetch } = useQuery<ArchiveVehicleDetailResult>(
    ARCHIVE_VEHICLE_DETAIL_QUERY,
    {
      variables: {
        where: { id: vehicleId },
        take: 1,
        skip: 0,
      },
      fetchPolicy: "network-only",
    }
  );

  const vehicle = data?.vehiclesArchive?.vehicles?.[0];
  const images = useMemo(
    () => normalizeVehicleImages(vehicle?.image),
    [vehicle?.image]
  );

  const backHref =
    eventArchiveId != null
      ? ROUTES.archiveEventVehicles(eventArchiveId, {
          eventNo: eventNo ? Number(eventNo) : undefined,
          sellerName: sellerName ?? undefined,
        })
      : ROUTES.archiveEvents;

  const backLabel =
    eventArchiveId != null ? "Back to Archived Vehicles" : "Back to Archived Events";

  return (
    <PageContainer
      title="Archived Vehicle Details"
      description={
        vehicle?.registrationNumber
          ? `Registration: ${vehicle.registrationNumber}`
          : undefined
      }
      actions={
        <Link href={backHref}>
          <Button type="button" size="sm" variant="outline">
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {backLabel}
          </Button>
        </Link>
      }
    >
      {loading ? (
        <LoadingState label="Loading archived vehicle…" />
      ) : error ? (
        <EmptyState
          title="Failed to load archived vehicle"
          description={extractGraphqlError(error).message}
          action={
            <button
              type="button"
              className="text-sm font-medium text-brand-600 hover:text-brand-900"
              onClick={() => refetch()}
            >
              Retry
            </button>
          }
        />
      ) : !vehicle ? (
        <EmptyState
          title="Archived vehicle not found"
          description="This vehicle may have been removed from the archive."
        />
      ) : (
        <FormCard title="Vehicle Information">
          <FormGrid columns={3}>
            <FormField label="Bid Status" htmlFor="archive-bid-status">
              <Input
                id="archive-bid-status"
                value={displayValue(vehicle.bidStatus)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Registration" htmlFor="archive-reg-no">
              <Input
                id="archive-reg-no"
                value={displayValue(vehicle.registrationNumber)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Loan Agreement Number" htmlFor="archive-loan-no">
              <Input
                id="archive-loan-no"
                value={displayValue(vehicle.loanAgreementNo)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Repo Date" htmlFor="archive-repo-date">
              <Input
                id="archive-repo-date"
                value={displayValue(vehicle.repoDt)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Start Price" htmlFor="archive-start-price">
              <Input
                id="archive-start-price"
                value={displayValue(vehicle.startPrice)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Reserve Price" htmlFor="archive-reserve-price">
              <Input
                id="archive-reserve-price"
                value={displayValue(vehicle.reservePrice)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Make" htmlFor="archive-make">
              <Input id="archive-make" value={displayValue(vehicle.make)} readOnly disabled />
            </FormField>
            <FormField label="Model" htmlFor="archive-model">
              <Input id="archive-model" value={displayValue(vehicle.model)} readOnly disabled />
            </FormField>
            <FormField label="Registered Owner Name" htmlFor="archive-owner">
              <Input
                id="archive-owner"
                value={displayValue(vehicle.registeredOwnerName)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="KM Reading" htmlFor="archive-km">
              <Input
                id="archive-km"
                value={displayValue(vehicle.kmReading)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Year Of Manufacture" htmlFor="archive-yom">
              <Input id="archive-yom" value={displayValue(vehicle.YOM)} readOnly disabled />
            </FormField>
            <FormField label="Ownership" htmlFor="archive-ownership">
              <Input
                id="archive-ownership"
                value={displayValue(vehicle.ownership)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Variant" htmlFor="archive-variant">
              <Input
                id="archive-variant"
                value={displayValue(vehicle.varient)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Quote Increment" htmlFor="archive-quote-inc">
              <Input
                id="archive-quote-inc"
                value={displayValue(vehicle.quoteIncreament)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Inspection Link" htmlFor="archive-inspection">
              <Input
                id="archive-inspection"
                value={displayValue(vehicle.inspectionLink)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="RC Status" htmlFor="archive-rc-status">
              <Input
                id="archive-rc-status"
                value={displayValue(vehicle.rcStatus)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Lot Number" htmlFor="archive-lot-number">
              <Input
                id="archive-lot-number"
                value={displayValue(vehicle.lotNumber)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Fuel" htmlFor="archive-fuel">
              <Input id="archive-fuel" value={displayValue(vehicle.fuel)} readOnly disabled />
            </FormField>
            <FormField label="Insurance Status" htmlFor="archive-insurance">
              <Input
                id="archive-insurance"
                value={displayValue(vehicle.insuranceStatus)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="City" htmlFor="archive-city">
              <Input id="archive-city" value={displayValue(vehicle.city)} readOnly disabled />
            </FormField>
            <FormField label="State" htmlFor="archive-state">
              <Input id="archive-state" value={displayValue(vehicle.state)} readOnly disabled />
            </FormField>
            <FormField label="Area" htmlFor="archive-area">
              <Input id="archive-area" value={displayValue(vehicle.area)} readOnly disabled />
            </FormField>
            <FormField label="Payment Terms" htmlFor="archive-payment-terms">
              <Input
                id="archive-payment-terms"
                value={displayValue(vehicle.paymentTerms)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Date of Registration" htmlFor="archive-reg-date">
              <Input
                id="archive-reg-date"
                value={displayValue(vehicle.dateOfRegistration)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Vehicle Condition" htmlFor="archive-condition">
              <Input
                id="archive-condition"
                value={displayValue(vehicle.vehicleCondition)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Chassis No" htmlFor="archive-chassis">
              <Input
                id="archive-chassis"
                value={displayValue(vehicle.chassisNo)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Yard Location" htmlFor="archive-yard-location">
              <Input
                id="archive-yard-location"
                value={displayValue(vehicle.yardLocation)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Current Bid Amount" htmlFor="archive-current-bid">
              <Input
                id="archive-current-bid"
                value={displayValue(vehicle.currentBidAmount)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Start Bid Amount" htmlFor="archive-start-bid">
              <Input
                id="archive-start-bid"
                value={displayValue(vehicle.startBidAmount)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Bid Start Time" htmlFor="archive-bid-start">
              <Input
                id="archive-bid-start"
                value={formatDate(vehicle.bidStartTime)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Bid End Time" htmlFor="archive-bid-end">
              <Input
                id="archive-bid-end"
                value={formatDate(vehicle.bidTimeExpire)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Total Bids" htmlFor="archive-total-bids">
              <Input
                id="archive-total-bids"
                value={displayValue(vehicle.totalBids)}
                readOnly
                disabled
              />
            </FormField>
            <FormField label="Archived On" htmlFor="archive-created-at">
              <Input
                id="archive-created-at"
                value={formatDate(vehicle.createdAt)}
                readOnly
                disabled
              />
            </FormField>

            {vehicle.loanAgreementNo && vehicle.registrationNumber ? (
              <VehicleImageGallery
                images={images}
                loanAgreementNo={vehicle.loanAgreementNo}
                registrationNumber={vehicle.registrationNumber}
              />
            ) : null}

            <FormField
              label="Image URLs"
              htmlFor="archive-image-urls"
              className="col-span-full"
            >
              <Textarea
                id="archive-image-urls"
                value={formatImageTextareaValue(vehicle.image)}
                readOnly
                disabled
                rows={6}
              />
            </FormField>
          </FormGrid>
        </FormCard>
      )}
    </PageContainer>
  );
}
