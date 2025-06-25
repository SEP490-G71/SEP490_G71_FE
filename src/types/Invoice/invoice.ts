import { InvoiceStatus } from "../../enums/InvoiceStatus/InvoiceStatus";


export interface InvoiceSummary {
  invoiceId: string;
  invoiceCode: string;
  patientName: string;
  amount: number;
  paymentType: string | null;
  status: InvoiceStatus;
  confirmedAt: string | null;
  createdAt: string | null;
   
}

export interface InvoiceItem {
  name: string;
  serviceCode: string;
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
  amount: number;
  paymentType: string | null;
  status: InvoiceStatus;
  confirmedAt: string | null;
  createdAt: string | null;
}
