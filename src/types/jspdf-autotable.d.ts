declare module "jspdf-autotable" {
  import type { jsPDF } from "jspdf";

  export interface AutoTableOptions {
    startY?: number;
    head?: unknown[][];
    body?: unknown[][];
    theme?: string;
    headStyles?: Record<string, unknown>;
    styles?: Record<string, unknown>;
    didParseCell?: (data: {
      column: { index: number };
      section: string;
      cell: { styles: Record<string, unknown> };
    }) => void;
  }

  export default function autoTable(
    doc: jsPDF,
    options: AutoTableOptions
  ): void;
}
