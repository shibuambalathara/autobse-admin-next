export function formatDate(dateString?: string | null): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

export function formatDateOnly(dateString?: string | null): string {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/** Convert month input (YYYY-MM) to ISO date for API filters. */
export function monthInputToIsoStart(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, 1)).toISOString();
  }
  return value;
}

/** Converts UTC ISO string to datetime-local value in Asia/Kolkata. */
export function convertUtcToDateTimeLocal(dateStr?: string | null): string {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  const localDate = dateObj.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const localTime = dateObj.toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
  });
  const dateSplitArr = localDate.split("/");
  const month = dateSplitArr[0];
  const date = dateSplitArr[1];
  const year = dateSplitArr[2];
  const timeSplitArr = localTime.split(":");
  const hour = timeSplitArr[0];
  const minute = timeSplitArr[1];
  if (!year || !month || !date || !hour || !minute) {
    return "";
  }
  return `${year}-${month}-${date}T${hour}:${minute}`;
}
