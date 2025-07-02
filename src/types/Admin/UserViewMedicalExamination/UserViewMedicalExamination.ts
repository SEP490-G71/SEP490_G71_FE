export interface QueuePatientsResponse {
  id: string;
  queueOrder: string;
  fullName: string;
  status: string;
  roomNumber?: number;
  type: string;
  calledTime?: string | null;
}
