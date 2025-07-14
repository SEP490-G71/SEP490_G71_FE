import React, { useState } from "react";

type VariableItem = { key: string; description: string };

const groupedVariables: {
  group: string;
  icon: string;
  variables: VariableItem[];
}[] = [
  {
    group: "Thông tin bệnh viện",
    icon: "🏥",
    variables: [
      { key: "HOSPITAL_NAME", description: "Tên bệnh viện" },
      { key: "HOSPITAL_ADDRESS", description: "Địa chỉ bệnh viện" },
      { key: "HOSPITAL_PHONE", description: "Số điện thoại bệnh viện" },
    ],
  },
  {
    group: "Thông tin hóa đơn",
    icon: "🧾",
    variables: [
      { key: "INVOICE_CODE", description: "Mã hóa đơn" },
      { key: "PAYMENT_DATE", description: "Ngày thanh toán" },
      { key: "CASHIER_NAME", description: "Tên người thu ngân" },
    ],
  },
  {
    group: "Thông tin khách hàng",
    icon: "👤",
    variables: [
      { key: "CUSTOMER_NAME", description: "Tên khách hàng" },
      { key: "CUSTOMER_PHONE", description: "Số điện thoại khách hàng" },
      { key: "CUSTOMER_CODE", description: "Mã khách hàng" },
    ],
  },
  {
    group: "Thông tin dịch vụ",
    icon: "🛒",
    variables: [
      { key: "INDEX", description: "Số thứ tự" },
      { key: "SERVICE_NAME", description: "Tên dịch vụ" },
      { key: "QUANTITY", description: "Số lượng" },
      { key: "PRICE", description: "Đơn giá" },
      { key: "DISCOUNT", description: "Giảm giá" },
      { key: "VAT", description: "Thuế VAT" },
      { key: "TOTAL", description: "Thành tiền" },
    ],
  },
  {
    group: "Thông tin thanh toán",
    icon: "📦",
    variables: [
      { key: "DESCRIPTION", description: "Mô tả" },
      { key: "ORIGINAL_TOTAL", description: "Tổng tiền gốc" },
      { key: "DISCOUNT_TOTAL", description: "Tổng giảm giá" },
      { key: "VAT_TOTAL", description: "Tổng tiền thuế VAT" },
      { key: "TOTAL_AMOUNT", description: "Tổng tiền thanh toán" },
    ],
  },
  {
    group: "Khác",
    icon: "🔗",
    variables: [{ key: "QR_IMAGE", description: "Mã QR (hình ảnh)" }],
  },
];

const TemplateVariablesTable: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-10 mt-6 px-2 sm:px-4">
      {groupedVariables.map((group, idx) => (
        <div key={idx}>
          <h2 className="text-md font-bold mb-2 text-gray-800">
            {group.icon} {group.group}
          </h2>
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th className="px-3 py-2 border w-1/3 text-left">Giá trị</th>
                  <th className="px-3 py-2 border w-2/3 text-left">
                    Diễn giải
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.variables.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 text-sm">
                    <td className="px-3 py-2 border break-all text-red-600 font-medium">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(item.key)}
                          className="hover:underline focus:outline-none"
                          title="Nhấn để sao chép"
                        >
                          {item.key}
                        </button>
                        {copiedKey === item.key && (
                          <span className="text-xs text-green-600">
                            ✓ Đã sao chép!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 border text-gray-700">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateVariablesTable;
