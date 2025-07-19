export interface Specialization {
  id: string;
  name: string;
  description?: string;
}

export interface CreateSpecializationRequest {
  name: string;
  description?: string;
}
