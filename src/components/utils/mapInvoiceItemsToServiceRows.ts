import { InvoiceItem } from "../../types/Invoice/invoice";
import { MedicalService } from "../../types/Admin/MedicalService/MedicalService";
import { ServiceItem } from "../../types/ServiceItem";

/**
 * Ánh xạ các mục trong hóa đơn sang định dạng ServiceItem hiển thị UI.
 */
export const mapInvoiceItemsToServiceItems = (
  items: InvoiceItem[],
  medicalServices: MedicalService[]
): ServiceItem[] => {
  return items.map((item, _) => {
    const matched = medicalServices.find(
      (s) =>
        s.serviceCode.trim().toLowerCase() ===
        item.serviceCode.trim().toLowerCase()
    );

    const departmentName = matched?.department?.name ?? "Không rõ";
    const departmentId = matched?.department?.id ?? null;
    // const serviceId = matched?.id ?? null;

    const result: ServiceItem = {
      code: item.serviceCode,
      name: matched?.name ?? item.name,
      departmentName,
      departmentId,   // ✅ Thêm departmentId
   
    };

    console.log("🧩 Dịch vụ map ra:", result);
    return result;
  });
};
