export interface State {
  id: string;
  name: string;
  createdAt?: string | null;
}

export interface StatesQueryResult {
  States: State[];
}

export interface CreateStateFormValues {
  name: string;
}
