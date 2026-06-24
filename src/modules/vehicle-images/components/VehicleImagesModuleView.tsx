"use client";

import { useState } from "react";
import { PageContainer } from "@/components/ui";
import { cn } from "@/lib/utils";
import { VehicleImageSearchView } from "@/modules/vehicle-images/components/VehicleImageSearchView";
import { VehicleImageUploadByUrlView } from "@/modules/vehicle-images/components/VehicleImageUploadByUrlView";
import { VehicleImageUploadView } from "@/modules/vehicle-images/components/VehicleImageUploadView";
import type { VehicleImagesView } from "@/modules/vehicle-images/types";

const tabClass = (active: boolean) =>
  cn(
    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-brand-800 text-white"
      : "bg-surface-muted text-brand-800 hover:bg-brand-50"
  );

export function VehicleImagesModuleView() {
  const [activeView, setActiveView] = useState<VehicleImagesView>("SEARCH");

  return (
    <PageContainer
      title="Vehicle Image Search & Upload"
      description="Search vehicle images by loan or registration number, upload files, or import from URLs."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          className={tabClass(activeView === "SEARCH")}
          onClick={() => setActiveView("SEARCH")}
        >
          Search Vehicle Images
        </button>
        <button
          type="button"
          className={tabClass(activeView === "UPLOAD")}
          onClick={() => setActiveView("UPLOAD")}
        >
          Upload Vehicle Image
        </button>
        <button
          type="button"
          className={tabClass(activeView === "UPLOAD_URL")}
          onClick={() => setActiveView("UPLOAD_URL")}
        >
          URL Direct Upload
        </button>
      </div>

      {activeView === "SEARCH" && <VehicleImageSearchView />}
      {activeView === "UPLOAD" && <VehicleImageUploadView />}
      {activeView === "UPLOAD_URL" && <VehicleImageUploadByUrlView />}
    </PageContainer>
  );
}
