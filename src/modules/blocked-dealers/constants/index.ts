export const BLOCKED_DEALERS_PAGE_SIZE = 10;

export const PAN_CARD_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export function isValidPanCard(value: string): boolean {
  return PAN_CARD_REGEX.test(value.trim().toUpperCase());
}

export function normalizePanCard(value: string): string {
  return value.trim().toUpperCase();
}
