import { InvoiceStatus } from "../../enums/InvoiceStatus/InvoiceStatus";


export interface InvoiceSummary {
  invoiceId: string;
  invoiceCode: string;
  patientName: string;
  amount: number;
  paymentType: "CASH" | "CARD" | null;
  status: "PAID" | "UNPAID";
  confirmedAt: string | null;
  createdAt: string;
}


export interface InvoiceItem {
  name: string;
  serviceCode: string;
  quantity: number;
  price: number;
  discount: number;
  vat: number;
  total: number;
  medicalServiceId?: string;
}

export interface InvoiceDetail {
  invoiceId: string;
  invoiceCode: string;
  patientName: string;
  patientCode: string;
  dateOfBirth: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "UNKNOWN";
  createdAt: string | null;
  paymentType: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
  items: InvoiceItem[];
  description: string | null;

  total: number;
  discountTotal: number;
  originalTotal: number;
  vatTotal: number;
}



export interface InvoiceResponse {
  invoiceId: string;
  invoiceCode: string;
  patientName: string;
  patientCode: string;
  amount: number; // = total
  total: number;
  discountTotal: number | null;
  originalTotal: number | null;
  vatTotal: number | null;
  paymentType: string | null;
  confirmedBy: string | null;
  description: string | null;
  status: InvoiceStatus;
  confirmedAt: string | null;
  createdAt: string | null;
}
