import {
  Grid,
  Paper,
  ScrollArea,
  Table,
  Text,
  Loader,
  Pagination,
} from "@mantine/core";
import { useEffect, useState } from "react";
import FilterPanel from "../../../components/common/FilterSection";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import ServiceExecutionPanel from "../../../components/medical/ServiceExecutionPanel";
import HeaderBar from "../../../components/medical/HeaderBar";
import ServiceResultPanel from "../../../components/medical/ServiceResultPanel";
import useMedicalRecordList from "../../../hooks/medicalRecord/useMedicalRecordList";
import { MedicalRecordStatusMap } from "../../../enums/MedicalRecord/MedicalRecordStatus";
import useMedicalRecordDetail from "../../../hooks/medicalRecord/useMedicalRecordDetail";
import { MedicalRecordOrder } from "../../../types/MedicalRecord/MedicalRecordDetail";

const ClinicalPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<MedicalRecordOrder | null>(
    null
  );
  const [isResultMode, setIsResultMode] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { records, loading, pagination, fetchMedicalRecords } =
    useMedicalRecordList();

  const {
    recordDetail,
    loading: loadingDetail,
    fetchMedicalRecordDetail,
  } = useMedicalRecordDetail();

  useEffect(() => {
    fetchMedicalRecords({
      page: page - 1,
      size: 10,
    });
  }, [page]);

  useEffect(() => {
    if (selectedRecordId) {
      fetchMedicalRecordDetail(selectedRecordId);
    }
  }, [selectedRecordId]);

  const handleSelectOrder = (order: MedicalRecordOrder) => {
    setSelectedOrder(order);
    setIsResultMode(true);
  };

  const handleCloseOrder = () => {
    setSelectedOrder(null);
    setIsResultMode(false);
  };

  const handleSelectInfo = () => {
    setIsResultMode(false);
  };

  const pendingOrders =
    recordDetail?.orders.filter((order) => order.status !== "COMPLETED") ?? [];

  const doneOrders =
    recordDetail?.orders.filter((order) => order.status === "COMPLETED") ?? [];

  return (
    <Grid>
      {/* Cột trái: Danh sách hồ sơ */}
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
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                    Mã hồ sơ
                  </th>
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                    Tên bệnh nhân
                  </th>
                  <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                    Người kê đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "12px" }}
                    >
                      <Loader size="sm" />
                      <Text mt="sm">Đang tải dữ liệu...</Text>
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", padding: "12px" }}
                    >
                      Chưa có dữ liệu dịch vụ
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr
                      key={record.id}
                      onClick={() => setSelectedRecordId(record.id)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedRecordId === record.id
                            ? "#e7f5ff"
                            : "transparent",
                      }}
                    >
                      <td style={{ paddingLeft: "10px" }}>
                        {MedicalRecordStatusMap[record.status] || record.status}
                      </td>
                      <td style={{ paddingLeft: "10px" }}>
                        {record.medicalRecordCode}
                      </td>
                      <td style={{ paddingLeft: "10px" }}>
                        {record.patientName}
                      </td>
                      <td style={{ paddingLeft: "10px" }}>
                        {record.doctorName}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </ScrollArea>

          <Pagination
            mt="md"
            value={page}
            onChange={setPage}
            total={pagination.totalPages}
            size="sm"
            withControls
            withEdges
          />
        </Paper>
      </Grid.Col>

      {/* Cột phải: Thông tin chi tiết và kết quả */}
      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <div style={{ marginTop: "-14px", marginBottom: "12px" }}>
          <HeaderBar
            selectedOrder={selectedOrder}
            isResultMode={isResultMode}
            onSelectInfo={handleSelectInfo}
            onViewResult={() => setIsResultMode(true)}
            onCloseOrder={handleCloseOrder}
          />
        </div>

        {selectedOrder && isResultMode ? (
          <ServiceResultPanel
            resultId={selectedOrder.id}
            serviceName={selectedOrder.serviceName}
            onSubmit={(result) => {
              console.log("🧾 Kết quả lưu:", result);
              handleCloseOrder();
            }}
            onCancel={handleCloseOrder}
          />
        ) : (
          <Paper shadow="xs" radius="md" p="md" withBorder mb="md">
            <PatientInfoPanel patient={null} />
            <ServiceExecutionPanel
              pendingServices={pendingOrders}
              doneServices={doneOrders}
              onAction={handleSelectOrder}
            />
          </Paper>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default ClinicalPage;
