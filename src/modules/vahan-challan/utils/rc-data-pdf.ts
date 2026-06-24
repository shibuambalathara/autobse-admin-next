import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatFieldName } from "@/modules/vahan-challan/utils/challan-formatters";
import type { ProvahanVehicleData } from "@/modules/vahan-challan/types";

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function downloadRcDetailsPdf(
  regNumber: string,
  vehicleData: ProvahanVehicleData
): void {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`RC Details - ${regNumber}`, 14, 20);
  doc.line(14, 22, 196, 22);

  const tableData = Object.entries(vehicleData)
    .filter(([key]) => key !== "__typename")
    .map(([key, value]) => [formatFieldName(key), formatValue(value)]);

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { cellPadding: 3, fontSize: 10 },
    didParseCell: (data) => {
      if (data.column.index === 1 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [0, 0, 0];
      }
    },
  });

  doc.save(`Vehicle_${regNumber}.pdf`);
}

export function downloadConfidentialRcPdf(
  regNumber: string,
  confidential: ProvahanVehicleData
): void {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Confidential RC - ${regNumber}`, 14, 20);
  doc.line(14, 22, 196, 22);

  const tableData = Object.entries(confidential)
    .filter(([key]) => key !== "__typename")
    .map(([key, value]) => [formatFieldName(key), formatValue(value)]);

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { cellPadding: 3, fontSize: 10 },
    didParseCell: (data) => {
      if (data.column.index === 1 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.textColor = [0, 0, 0];
      }
    },
  });

  doc.save(`Confidential_RC_${regNumber}.pdf`);
}
