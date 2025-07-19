export interface DivideShift {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface CreateDivideShiftRequest {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}
