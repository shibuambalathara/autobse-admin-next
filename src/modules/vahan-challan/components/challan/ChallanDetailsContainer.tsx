"use client";

import { useChallanDetails } from "@/modules/vahan-challan/hooks/useChallanDetails";
import { ChallanDetailsView } from "@/modules/vahan-challan/components/challan/ChallanDetailsView";
import {
  downloadChallanPdf,
  downloadChallanSummaryPdf,
} from "@/modules/vahan-challan/utils/challan-pdf";

export function ChallanDetailsContainer() {
  const challan = useChallanDetails();

  return (
    <ChallanDetailsView
      rcNumber={challan.rcNumber}
      setRcNumber={challan.setRcNumber}
      chassisNum={challan.chassisNum}
      setChassisNum={challan.setChassisNum}
      engineNum={challan.engineNum}
      setEngineNum={challan.setEngineNum}
      challans={challan.challans}
      blacklist={challan.blacklist}
      summary={challan.summary}
      loading={challan.loading}
      summaryLoading={challan.summaryLoading}
      hasSearched={challan.hasSearched}
      errorMsg={challan.errorMsg}
      onSearch={challan.searchChallans}
      onFetchSummary={challan.fetchChallanSummary}
      onDownloadPDF={() =>
        downloadChallanPdf(
          challan.rcNumber,
          challan.challans,
          challan.blacklist
        )
      }
      onDownloadSummaryPDF={() => {
        if (challan.summary) {
          downloadChallanSummaryPdf(challan.rcNumber, challan.summary);
        }
      }}
    />
  );
}
