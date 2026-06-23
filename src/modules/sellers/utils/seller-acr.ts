import { exportAcrReport } from "@/modules/events/utils/event-acr";

export function buildSellerAcrFileName(sellerName: string): string {
  const cleanedName = sellerName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `ACR_Report_${cleanedName}.xlsx`;
}

export function exportSellerAcrReport(
  report: Record<string, unknown>[] | null | undefined,
  sellerName: string
): boolean {
  return exportAcrReport(report, buildSellerAcrFileName(sellerName));
}
