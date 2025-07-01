import { Grid, Paper, ScrollArea, Table } from "@mantine/core";
import { useEffect, useState } from "react";
import FilterPanel from "../../../components/common/FilterSection";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import ServiceExecutionPanel from "../../../components/medical/ServiceExecutionPanel";
import HeaderBar from "../../../components/medical/HeaderBar";
import ServiceResultPanel from "../../../components/medical/ServiceResultPanel";
import { useFilteredInvoices } from "../../../hooks/invoice/useInvoice";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import { ServiceItem } from "../../../types/ServiceItem";
import { mapInvoiceItemsToServiceItems } from "../../../components/utils/mapInvoiceItemsToServiceRows";

const TARGET_DEPARTMENT_NAME = "phòng lâm sàng";

const ClinicalPage = () => {
  useEffect(() => {}, []);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isResultMode, setIsResultMode] = useState(false);
  const { medicalServices, fetchAllMedicalServices } = useMedicalService();
  const {
    invoices,
    fetchInvoices,
    fetchInvoiceDetail,
    invoiceDetail,
    loadingList,
    pagination,
  } = useFilteredInvoices();

  // Lấy danh sách hóa đơn đã thanh toán
  useEffect(() => {
    fetchInvoices({ status: "PAID" }, 0, 10);
    fetchAllMedicalServices(0, 100);
  }, []);

  // Khi chọn hóa đơn thì tự động lấy chi tiết hóa đơn đó
  useEffect(() => {
    if (selectedInvoice?.invoiceId) {
      fetchInvoiceDetail(selectedInvoice.invoiceId);
      console.log("Selected invoice ID:", selectedInvoice.invoiceId);
    }
  }, [selectedInvoice]);

  useEffect(() => {
    if (medicalServices.length > 0) {
      console.log("🔍 medicalServices[0]", medicalServices[0]);
      console.log(
        "🏥 Department trong service:",
        medicalServices[0]?.department
      );
    }
  }, [medicalServices]);

  const [pendingServices, setPendingServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    console.log("🧾 invoiceDetail.items:", invoiceDetail?.items);
    console.log("🧪 medicalServices:", medicalServices);

    if (invoiceDetail?.items && medicalServices.length > 0) {
      const mapped = mapInvoiceItemsToServiceItems(
        invoiceDetail.items,
        medicalServices
      );

      // ⚠️ Lọc chỉ giữ dịch vụ ở phòng lâm sàng
      const filtered = mapped.filter(
        (item) =>
          item.departmentName?.trim().toLowerCase() ===
          TARGET_DEPARTMENT_NAME.trim().toLowerCase()
      );
      console.log("✅ Filtered pendingServices:", filtered);
      setPendingServices(filtered);
    }
  }, [invoiceDetail?.items, medicalServices]);

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setIsResultMode(true);
  };

  const handleCloseService = () => {
    setSelectedService(null);
    setIsResultMode(false);
  };

  const handleSelectInfo = () => {
    setIsResultMode(false);
  };

  return (
    <Grid>
      {/* Cột trái: Bộ lọc */}
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <FilterPanel />
        <Paper shadow="xs" p="md" radius="md" withBorder>
          <ScrollArea offsetScrollbars scrollbarSize={8} h={300}>
            <Table
              withColumnBorders
              highlightOnHover
              style={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "2px",
              }}
            >
              <thead style={{ backgroundColor: "#dee2e6" }}>
                <tr>
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                    Trạng thái
                  </th>
                  <th style={{ textAlign: "center" }}>Mã hóa đơn</th>
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                    Tên bệnh nhân
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "12px" }}
                    >
                      Đang tải danh sách hóa đơn...
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ textAlign: "center", padding: "12px" }}
                    >
                      Không có hóa đơn đã thanh toán.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const isSelected =
                      selectedInvoice?.invoiceId === inv.invoiceId;
                    return (
                      <tr
                        key={inv.invoiceId}
                        onClick={() => setSelectedInvoice(inv)}
                        style={{
                          backgroundColor: isSelected ? "#e0f2ff" : "white",
                          borderBottom: "1px solid #adb5bd",
                          cursor: "pointer",
                        }}
                      >
                        <td
                          style={{
                            textAlign: "left",
                            paddingLeft: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {inv.status}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {inv.invoiceCode}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            paddingLeft: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {inv.patientName}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </ScrollArea>
        </Paper>
      </Grid.Col>

      {/* Cột phải: Header + Nội dung chính */}
      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <div style={{ marginTop: "-14px", marginBottom: "12px" }}>
          <HeaderBar
            selectedService={selectedService}
            isResultMode={isResultMode}
            onSelectInfo={handleSelectInfo}
            onViewResult={() => setIsResultMode(true)}
            onCloseService={handleCloseService}
          />
        </div>
        {/* Nếu đang lập kết quả */}

        {selectedService && isResultMode ? (
          <ServiceResultPanel
            serviceName={selectedService.name}
            departmentId={selectedService.departmentId}
            onSubmit={(result) => {
              console.log("🧾 Kết quả lưu:", result);
              handleCloseService();
            }}
            onCancel={handleCloseService}
          />
        ) : (
          <>
            {/* Thông tin khám */}
            <Paper shadow="xs" radius="md" p="md" withBorder mb="md">
              <PatientInfoPanel patient={null} />

              {/* Danh sách dịch vụ */}
              <ServiceExecutionPanel
                pendingServices={pendingServices}
                onAction={handleSelectService}
              />
            </Paper>
          </>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default ClinicalPage;
