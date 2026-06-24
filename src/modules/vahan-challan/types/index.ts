export type VahanDetailsWhereInput = {
  id_number: string;
};

export type ProvahanVehicleData = Record<string, unknown>;

export interface VahanJsonResult {
  getParivahanDataJson?: {
    provahanData?: ProvahanVehicleData | null;
  } | null;
}

export interface ConfidentialVahanDataResult {
  getAllParivahanDataJson?: {
    provahanData?: ProvahanVehicleData | null;
  } | null;
}

export interface ChallanRecord {
  [key: string]: unknown;
}

export interface ChallanApiResponse {
  challans?: ChallanRecord[];
  blacklist?: unknown[];
}

export interface ChallanQueryResult {
  getProvahanChallanData?: ChallanApiResponse | null;
}

export interface ChallanSummaryResult {
  getChallanSummaryFromJson?: Record<string, unknown> | null;
}

export type VahanChallanView = "RC" | "CHALLAN";
