"use client";

import { useState } from "react";
import { PageContainer } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ChallanDetailsContainer } from "@/modules/vahan-challan/components/challan/ChallanDetailsContainer";
import { VahanDetailsContainer } from "@/modules/vahan-challan/components/rc/VahanDetailsContainer";
import type { VahanChallanView } from "@/modules/vahan-challan/types";

const tabClass = (active: boolean) =>
  cn(
    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-brand-800 text-white"
      : "bg-surface-muted text-brand-800 hover:bg-brand-50"
  );

export function VahanChallanModuleView() {
  const [activeView, setActiveView] = useState<VahanChallanView>("RC");

  return (
    <PageContainer
      title="Challan & RC Details"
      description="Look up Parivahan RC data and challan records by registration number."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          className={tabClass(activeView === "RC")}
          onClick={() => setActiveView("RC")}
        >
          RC Data
        </button>
        <button
          type="button"
          className={tabClass(activeView === "CHALLAN")}
          onClick={() => setActiveView("CHALLAN")}
        >
          Challan Details
        </button>
      </div>

      {activeView === "RC" ? <VahanDetailsContainer /> : <ChallanDetailsContainer />}
    </PageContainer>
  );
}
