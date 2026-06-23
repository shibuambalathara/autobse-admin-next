import Link from "next/link";
import { PageContainer, buttonVariants } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

/** Vehicles are managed per event — redirect users to the events list. */
export function VehiclesModuleView() {
  return (
    <PageContainer
      title="Vehicles"
      description="Vehicles are managed within each event. Open an event to view, add, or edit vehicles."
      actions={
        <Link href={ROUTES.events} className={buttonVariants({ size: "sm" })}>
          Go to Events
        </Link>
      }
    >
      <p className="text-sm text-muted-foreground">
        Use the Events list to open a specific event, then view its vehicles from the event table actions.
      </p>
    </PageContainer>
  );
}
