export type CallScheduleStatus = "ACTIVE" | "PENDING" | "CLOSED";

export type ScheduleCallState =
  | "Maharashtra"
  | "Bihar"
  | "Chhattisgarh"
  | "Karnataka"
  | "Manipur"
  | "Arunachal_Pradesh"
  | "Assam"
  | "Gujarat"
  | "Punjab"
  | "Mizoram"
  | "Andhra_Pradesh"
  | "West_Bengal"
  | "Goa"
  | "Haryana"
  | "Himachal_Pradesh"
  | "Kerala"
  | "Rajasthan"
  | "Jharkhand"
  | "Madhya_Pradesh"
  | "Odisha"
  | "Nagaland"
  | "TamilNadu"
  | "Uttar_Pradesh"
  | "Telangana"
  | "Meghalaya"
  | "Sikkim"
  | "Tripura"
  | "Uttarakhand"
  | "Jammu_and_Kashmir"
  | "Delhi"
  | "Lakshadweep"
  | "Puducherry"
  | "Ladakh"
  | "Chandigarh"
  | "Andaman_and_Nicobar_Islands"
  | "Dadra_and_Nagar_Haveli_and_Daman_and_Diu"
  | "PAN_INDIA";

export interface ScheduleCall {
  id: string;
  ScheduleNo?: number | null;
  fullName?: string | null;
  email?: string | null;
  mobile?: string | null;
  PreferredDate?: string | null;
  message?: string | null;
  createdAt?: string | null;
  status?: CallScheduleStatus | null;
  state?: ScheduleCallState | string | null;
}

export interface ScheduleCallWhereInput {
  status?: CallScheduleStatus;
  state?: ScheduleCallState | string;
}

export interface ScheduleCallsListResult {
  scheduleCalls: {
    schedulecallCount?: number | null;
    schedulecalls: ScheduleCall[];
  };
}

export interface DeletedScheduleCallsResult {
  deletedSchedulecalls: {
    deletedSchedulecallCount?: number | null;
    schedulecalls: ScheduleCall[];
  };
}

export interface ScheduleCallsQueryVariables {
  where?: ScheduleCallWhereInput;
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: Array<{ PreferredDate?: "ASC" | "DESC"; createdAt?: "ASC" | "DESC" }>;
}

export interface UpdateScheduleCallInput {
  status?: CallScheduleStatus;
}
