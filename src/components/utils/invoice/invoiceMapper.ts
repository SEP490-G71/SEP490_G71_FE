import { MedicalService } from "../../../types/Admin/MedicalService/MedicalService";
import { InvoiceItem } from "../../../types/Invoice/invoice";

export interface ServiceRow {
  id: number;
  serviceId: string | null;
  quantity: number;
}

export const mapInvoiceItemsToServiceRows = (
  items: InvoiceItem[],
  medicalServices: MedicalService[]
): ServiceRow[] => {
  return items.map((item, index) => {
    const matched = medicalServices.find(
      (s) => s.serviceCode === item.serviceCode
    );

    return {
      id: index + 1,
      serviceId: matched?.id ?? null,
      quantity: item.quantity,
    };
  });
};
