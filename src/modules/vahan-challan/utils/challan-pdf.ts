import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  formatFieldName,
  formatSummaryKey,
} from "@/modules/vahan-challan/utils/challan-formatters";
import type {
  ChallanRecord,
} from "@/modules/vahan-challan/types";

function getFinalY(doc: jsPDF): number {
  const withTable = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  return withTable.lastAutoTable?.finalY ?? 30;
}

export function downloadChallanPdf(
  rcNumber: string,
  challans: ChallanRecord[],
  blacklist: unknown[]
): void {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Challan Details - ${rcNumber}`, 14, 20);
  doc.line(14, 22, 196, 22);

  let startY = 30;

  challans.forEach((challan, index) => {
    doc.text(`Challan #${index + 1}`, 14, startY);
    startY += 5;

    const tableData = Object.entries(challan).map(([key, value]) => [
      formatFieldName(key),
      Array.isArray(value)
        ? JSON.stringify(value, null, 2)
        : String(value ?? "-"),
    ]);

    autoTable(doc, {
      startY,
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

    startY = getFinalY(doc) + 10;
  });

  doc.text("Blacklist", 14, startY);

  autoTable(doc, {
    startY: startY + 5,
    head: [["Data"]],
    body:
      blacklist.length > 0
        ? blacklist.map((item) => [JSON.stringify(item)])
        : [["No blacklist data"]],
  });

  doc.save(`Challan_${rcNumber}.pdf`);
}

export function downloadChallanSummaryPdf(
  rcNumber: string,
  summary: Record<string, unknown>
): void {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Challan Summary - ${rcNumber}`, 14, 20);

  const tableData = Object.entries(summary).map(([key, value]) => [
    formatSummaryKey(key),
    String(value),
  ]);

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: tableData,
  });

  doc.save(`Challan_Summary_${rcNumber}.pdf`);
}
