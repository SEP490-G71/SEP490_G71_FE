export interface InvoiceItemUpdateRequest {
  serviceId: string;
  quantity: number;
}

export interface UpdateInvoiceRequest {
  invoiceId: string;
  staffId: string;
  services: InvoiceItemUpdateRequest[];
}