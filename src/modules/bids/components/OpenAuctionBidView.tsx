"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { PageContainer, buttonVariants } from "@/components/ui";
import { LoadingState } from "@/components/feedback";
import { EnterBidForm } from "@/modules/bids/components/EnterBidForm";
import { OPEN_VEHICLE_BID_QUERY } from "@/graphql/documents/vehicles";
import { ROUTES } from "@/constants/routes";
import { extractGraphqlError } from "@/lib/graphql-errors";

interface OpenAuctionBidViewProps {
  vehicleId: string;
}

export function OpenAuctionBidView({ vehicleId }: OpenAuctionBidViewProps) {
  const { data, loading, error, refetch } = useQuery<{
    vehicle: {
      id: string;
      registrationNumber?: string | null;
      startPrice?: number | null;
      startBidAmount?: number | null;
      currentBidAmount?: number | null;
      quoteIncreament?: number | null;
    };
  }>(OPEN_VEHICLE_BID_QUERY, { variables: { where: { id: vehicleId } } });

  const vehicle = data?.vehicle;

  if (loading) return <LoadingState label="Loading open auction…" />;
  if (error || !vehicle) {
    return (
      <p className="text-destructive">
        {error ? extractGraphqlError(error).message : "Vehicle not found."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <PageContainer
        title="Open Auction Bid"
        description={vehicle.registrationNumber ?? undefined}
        actions={
          <Link
            href={ROUTES.vehicleEdit(vehicleId)}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Vehicle Details
          </Link>
        }
      >
        <EnterBidForm
          vehicle={{
            id: vehicle.id,
            registrationNumber: vehicle.registrationNumber,
            startPrice: vehicle.startPrice ?? vehicle.startBidAmount ?? undefined,
            currentBidAmount: vehicle.currentBidAmount ?? undefined,
            quoteIncreament: vehicle.quoteIncreament ?? undefined,
          }}
          eventCategory="open"
          onSuccess={() => refetch()}
        />

        <div className="mt-4">
          <Link
            href={ROUTES.bidDetails(vehicleId)}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            View Bid History
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
