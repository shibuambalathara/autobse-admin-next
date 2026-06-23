export interface LocationState {
  id?: string | null;
  name?: string | null;
}

export interface Location {
  id: string;
  name: string;
  country?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  state?: LocationState | null;
}

export interface LocationsListResult {
  locations: {
    locations: Location[];
    locationsCount?: number | null;
  };
}

export interface LocationWhereUniqueInput {
  id?: string;
  name?: string;
  state?: string;
}

export interface ListLocationsVariables {
  search?: string;
  where?: LocationWhereUniqueInput;
  take?: number;
  skip?: number;
  orderBy?: Array<{ name?: "ASC" | "DESC" }>;
}

export interface CreateLocationFormValues {
  name: string;
  stateId: string;
}

export interface EditLocationFormValues {
  name: string;
  stateId: string;
}

export interface StateOption {
  id: string;
  name: string;
}

export type { StatesQueryResult } from "@/modules/states/types";
