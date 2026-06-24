"use client";

import { Button, Input } from "@/components/ui";
import { FormField } from "@/components/forms";
import { LoadingState } from "@/components/feedback";
import { VahanSearch } from "@/modules/vahan-challan/components/rc/VahanSearch";
import {
  formatFieldName,
  formatSummaryKey,
} from "@/modules/vahan-challan/utils/challan-formatters";
import { downloadElementAsJpeg } from "@/modules/vahan-challan/utils/download-jpeg";
import type { ChallanRecord } from "@/modules/vahan-challan/types";

interface ChallanDetailsViewProps {
  rcNumber: string;
  setRcNumber: (value: string) => void;
  chassisNum: string;
  setChassisNum: (value: string) => void;
  engineNum: string;
  setEngineNum: (value: string) => void;
  challans: ChallanRecord[];
  blacklist: unknown[];
  summary: Record<string, unknown> | null;
  loading: boolean;
  summaryLoading: boolean;
  hasSearched: boolean;
  errorMsg: string;
  onSearch: () => void;
  onFetchSummary: () => void;
  onDownloadPDF: () => void;
  onDownloadSummaryPDF: () => void;
}

export function ChallanDetailsView({
  rcNumber,
  setRcNumber,
  chassisNum,
  setChassisNum,
  engineNum,
  setEngineNum,
  challans,
  blacklist,
  summary,
  loading,
  summaryLoading,
  hasSearched,
  errorMsg,
  onSearch,
  onFetchSummary,
  onDownloadPDF,
  onDownloadSummaryPDF,
}: ChallanDetailsViewProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-center text-xl font-semibold text-red-600">
        Challan Details
      </h2>

      <VahanSearch
        value={rcNumber}
        onChange={setRcNumber}
        onSearch={onSearch}
        loading={loading}
        placeholder="Enter Registration Number"
        rightAction={
          <Button
            type="button"
            variant="secondary"
            onClick={onFetchSummary}
            isLoading={summaryLoading}
            loadingText="Fetching..."
          >
            Get Brief
          </Button>
        }
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Chassis Number" htmlFor="challan-chassis-num">
          <Input
            id="challan-chassis-num"
            value={chassisNum}
            onChange={(e) => setChassisNum(e.target.value)}
            placeholder="Enter Chassis Number"
          />
        </FormField>

        <FormField label="Engine Number" htmlFor="challan-engine-num">
          <Input
            id="challan-engine-num"
            value={engineNum}
            onChange={(e) => setEngineNum(e.target.value)}
            placeholder="Enter Engine Number"
          />
        </FormField>
      </div>

      {loading && <LoadingState label="Fetching challan details…" />}

      {errorMsg ? (
        <p className="mt-4 text-center text-sm font-medium text-red-600">
          {errorMsg}
        </p>
      ) : null}

      {challans.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button type="button" onClick={onDownloadPDF}>
            Download PDF
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              downloadElementAsJpeg(
                "challan-details-section",
                `Challan_${rcNumber}.jpeg`
              )
            }
          >
            Download JPEG
          </Button>
        </div>
      )}

      <div id="challan-details-section">
        {challans.map((challan, index) => (
          <div
            key={index}
            className="mb-6 rounded-lg border border-surface-border bg-surface-muted p-4 shadow-sm"
          >
            <h3 className="mb-3 text-lg font-semibold text-red-600">
              Challan #{index + 1}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(challan).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm font-medium text-gray-600">
                    {formatFieldName(key)}
                  </div>
                  <div className="break-words text-sm font-semibold text-gray-900">
                    {Array.isArray(value)
                      ? JSON.stringify(value, null, 2)
                      : String(value ?? "-")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {hasSearched && (
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-red-700">
              Blacklist
            </h3>
            {blacklist.length === 0 ? (
              <p className="text-sm text-gray-500">No blacklist data</p>
            ) : (
              <pre className="overflow-auto rounded bg-gray-100 p-3 text-sm">
                {JSON.stringify(blacklist, null, 2)}
              </pre>
            )}
          </div>
        )}

        {summary && (
          <div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onDownloadSummaryPDF}>
                Download Summary PDF
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  downloadElementAsJpeg(
                    "challan-summary-section",
                    `Challan_Summary_${rcNumber}.jpeg`
                  )
                }
              >
                Download Summary JPEG
              </Button>
            </div>

            <div
              id="challan-summary-section"
              className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 shadow-sm"
            >
              <h3 className="mb-3 text-lg font-semibold text-indigo-700">
                Challan Summary
              </h3>

              <div className="grid gap-4 text-sm md:grid-cols-3">
                {Object.entries(summary).map(([key, value]) => (
                  <div key={key}>
                    <div className="font-medium text-gray-600">
                      {formatSummaryKey(key)}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {key.toLowerCase().includes("amount")
                        ? `₹${String(value)}`
                        : String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
