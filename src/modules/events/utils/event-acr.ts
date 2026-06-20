import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { formatDate } from "@/lib/date-format";

type AcrRow = Record<string, unknown>;

function formatAcrRow(item: AcrRow): AcrRow {
  const formatted = { ...item };
  if (typeof formatted.createdAt === "string") {
    formatted.createdAt = formatDate(formatted.createdAt);
  }
  if (typeof formatted.updatedAt === "string") {
    formatted.updatedAt = formatDate(formatted.updatedAt);
  }
  if (typeof formatted.RegistrationExpire === "string") {
    formatted.RegistrationExpire = formatDate(formatted.RegistrationExpire);
  }
  return formatted;
}

export function buildAcrFileName(event: {
  eventNo?: number | null;
  seller?: { name?: string | null } | null;
  location?: { name?: string | null } | null;
}): string {
  const clientName = (event.seller?.name || "Client").replace(/[^\w\s-]/g, "").trim();
  const locationName = (event.location?.name || "Location")
    .replace(/[^\w\s-]/g, "")
    .trim();
  const auctionNo = event.eventNo ?? "No";
  return `ACR ${auctionNo} ${clientName}_${locationName}.xlsx`;
}

export function exportAcrReport(
  report: AcrRow[] | null | undefined,
  fileName: string
): boolean {
  if (!report || report.length === 0) {
    return false;
  }

  const formattedData = report.map(formatAcrRow);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, fileName || "ACR_Report.xlsx");
  return true;
}
