import {
  Grid,
  Paper,
  ScrollArea,
  Table,
  Text,
  Loader,
  Pagination,
  Select,
  Group,
  Title,
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
  const [pageSize, setPageSize] = useState(10);
  const { records, loading, pagination, fetchMedicalRecords } =
    useMedicalRecordList();

  const { recordDetail, fetchMedicalRecordDetail } = useMedicalRecordDetail();

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
  useEffect(() => {
    fetchMedicalRecords({
      page: page - 1,
      size: pageSize,
      status: "TESTING",
    });
  }, [page, pageSize]);
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
  const testingRecords = records.filter(
    (record) => record.status === "TESTING"
  );

  const pendingOrders =
    recordDetail?.orders.filter((order) => order.status !== "COMPLETED") ?? [];

  const doneOrders =
    recordDetail?.orders.filter((order) => order.status === "COMPLETED") ?? [];

  return (
    <Grid>
      {/* Cột trái: Danh sách hồ sơ */}
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Paper shadow="xs" p="md" radius="md" mb="md" withBorder>
          <FilterPanel />
        </Paper>

        <Paper shadow="xs" radius="md" p="md" withBorder>
          <Title order={5} mb="md">
            Danh sách hồ sơ
          </Title>

          {loading ? (
            <Loader />
          ) : (
            <>
              <ScrollArea offsetScrollbars scrollbarSize={8} h="auto">
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
                      <th style={{ textAlign: "center" }}>Mã hồ sơ</th>
                      <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                        Tên bệnh nhân
                      </th>
                      <th style={{ textAlign: "left", paddingLeft: "10px" }}>
                        Người kê đơn
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {testingRecords.map((record, index) => {
                      const isSelected = selectedRecordId === record.id;
                      return (
                        <tr
                          key={record.id}
                          onClick={() => setSelectedRecordId(record.id)}
                          style={{
                            cursor: "pointer",
                            backgroundColor: isSelected
                              ? "#cce5ff"
                              : index % 2 === 0
                              ? "#f8f9fa"
                              : "#e9ecef",
                            borderBottom: "1px solid #adb5bd",
                          }}
                        >
                          <td
                            style={{
                              paddingLeft: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {MedicalRecordStatusMap[record.status] ||
                              record.status}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {record.medicalRecordCode}
                          </td>
                          <td
                            style={{
                              paddingLeft: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {record.patientName}
                          </td>
                          <td
                            style={{
                              paddingLeft: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {record.doctorName}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </ScrollArea>

              {/* Pagination + Info */}
              <Group justify="space-between" mt="sm">
                <Text size="sm">
                  {testingRecords.length > 0
                    ? `${(page - 1) * pageSize + 1}–${
                        (page - 1) * pageSize + testingRecords.length
                      } của ${pagination.totalElements}`
                    : "Không có hồ sơ "}
                </Text>

                <Group>
                  <Select
                    data={["5", "10", "20"]}
                    value={pageSize.toString()}
                    onChange={(value) => {
                      if (value) {
                        setPageSize(parseInt(value));
                        setPage(1);
                      }
                    }}
                    w={100}
                    variant="filled"
                    size="xs"
                  />

                  <Pagination
                    total={pagination.totalPages}
                    value={page}
                    onChange={setPage}
                    size="sm"
                  />
                </Group>
              </Group>
            </>
          )}
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
            medicalOrderId={selectedOrder.id}
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
