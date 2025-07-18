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
  serviceCode: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  vat: number;
  total: number;
}

export interface InvoiceDetail {
  invoiceId: string;
  invoiceCode: string;
  patientName: string;
  amount: number;
  paymentType: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
  items: InvoiceItem[];
}


export interface InvoiceResponse {
  invoiceId: string;
  invoiceCode: string;
  patientName: string;
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
