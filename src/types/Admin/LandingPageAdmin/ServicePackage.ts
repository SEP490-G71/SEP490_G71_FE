export interface ServicePackage {
  id: string;
  packageName: string;
  description: string;
  billingType: "MONTHLY" | "YEARLY";
  price: number;
  status: string;
  startDate: string;
  endDate: string;
}
