import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDate } from "@/lib/date-format";

type ExcelRow = Record<string, unknown>;

export function exportRowsToExcel(
  data: ExcelRow[],
  fileName = "export.xlsx"
): void {
  if (typeof window === "undefined") {
    throw new Error("Excel export is only available in the browser.");
  }

  if (!data.length) {
    throw new Error("No rows to export.");
  }
  const formattedData = data.map((row) => {
    const { id, __typename, role, country, ...rest } = row as ExcelRow & {
      id?: string;
      __typename?: string;
      role?: string;
      country?: string;
    };
    void id;
    void __typename;
    void role;
    void country;

    const formattedItem = { ...rest };
    if (rest.createdAt) {
      formattedItem.createdAt = formatDate(String(rest.createdAt));
    }
    if (rest.updatedAt) {
      formattedItem.updatedAt = formatDate(String(rest.updatedAt));
    }
    return formattedItem;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = {
    Sheets: { data: worksheet },
    SheetNames: ["data"],
  };
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, fileName);
}
