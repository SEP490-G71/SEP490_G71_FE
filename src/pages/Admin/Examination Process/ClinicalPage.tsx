import { Autocomplete, Divider, Grid, Paper, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import FilterPanel, {
  FilterField,
} from "../../../components/common/FilterSection";
import { FloatingLabelWrapper } from "../../../components/common/FloatingLabelWrapper";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import ServiceExecutionPanel from "../../../components/medical/ServiceExecutionPanel";
import HeaderBar from "../../../components/medical/HeaderBar";
import ServiceResultPanel from "../../../components/medical/ServiceResultPanel";
import ClinicList from "../../../components/subClinical/ClinicList";

import useMedicalRecordList from "../../../hooks/medicalRecord/useMedicalRecordList";
import useMedicalRecordDetail from "../../../hooks/medicalRecord/useMedicalRecordDetail";
import useMedicalOrdersByDepartment from "../../../hooks/medicalRecord/useMedicalOrdersByDepartment";
import useQueuePatientService from "../../../hooks/queue-patients/useSearchQueuePatients";
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import useMyDepartment from "../../../hooks/department-service/useMyDepartment";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";
import { usePatientManagement } from "../../../hooks/Patient-Management/usePatientManagement";
import { useSearchPatients } from "../../../hooks/Patient-Management/useSearchPatients";

import { MedicalRecordOrder } from "../../../types/MedicalRecord/MedicalRecordDetail";
import { QueuePatient } from "../../../types/Queue-patient/QueuePatient";
import {
  MedicalRecordStatus,
  MedicalRecordStatusMap,
} from "../../../enums/MedicalRecord/MedicalRecordStatus";

const ClinicalPage = () => {
  //  State
  const [selectedOrder, setSelectedOrder] = useState<MedicalRecordOrder | null>(
    null
  );
  const [isResultMode, setIsResultMode] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterKey, setFilterKey] = useState(0);
  const [filters, setFilters] = useState({
    patientId: "",
    medicalRecordCode: "",
    fromDate: new Date(),
    toDate: new Date(),
    status: MedicalRecordStatus.TESTING,
  });

  const [patientCode, setPatientCode] = useState<string | null>(null);
  const [selectedQueuePatient, setSelectedQueuePatient] =
    useState<QueuePatient | null>(null);

  //  Hooks
  const { userInfo } = useUserInfo();
  const { fetchStaffsById } = useStaffs();
  const { department } = useMyDepartment();
  const { fetchPatientById } = usePatientManagement();

  const { orders: departmentOrders } = useMedicalOrdersByDepartment(
    department?.id || ""
  );
  const { records, loading, pagination, fetchMedicalRecords } =
    useMedicalRecordList();
  const { recordDetail, fetchMedicalRecordDetail } = useMedicalRecordDetail();
  const { patients: queuePatients, updateFilters } = useQueuePatientService();

  const [technicalName, setTechnicalName] = useState("Không rõ");

  // Load bác sĩ kỹ thuật
  useEffect(() => {
    const fetch = async () => {
      if (userInfo?.userId) {
        const data = await fetchStaffsById(userInfo.userId);
        if (data) setTechnicalName(data.fullName || "Không rõ");
      }
    };
    fetch();
  }, [userInfo?.userId]);

  //  Load danh sách hồ sơ theo filter
  useEffect(() => {
    fetchMedicalRecords({
      patientId: filters.patientId,
      medicalRecordCode: filters.medicalRecordCode,
      fromDate: dayjs(filters.fromDate).format("YYYY-MM-DD"),
      toDate: dayjs(filters.toDate).format("YYYY-MM-DD"),
      page: page - 1,
      size: pageSize,
      status: filters.status,
    });
  }, [page, pageSize, filters]);

  //  Load chi tiết hồ sơ
  useEffect(() => {
    if (selectedRecordId) {
      fetchMedicalRecordDetail(selectedRecordId);
      console.log("🩺 Hồ sơ được chọn:", selectedRecordId);
    }
  }, [selectedRecordId]);

  //  Khi đã có recordDetail → fetch bệnh nhân → lấy patientCode → tìm QueuePatient
  useEffect(() => {
    const load = async () => {
      if (!recordDetail?.patientId) return;
      const patient = await fetchPatientById(recordDetail.patientId);
      console.log("👤 Thông tin bệnh nhân:", patient);
      if (!patient?.patientCode) {
        toast.error("Không tìm thấy mã bệnh nhân");
        return;
      }
      setPatientCode(patient.patientCode);
      console.log("✅ Set patientCode:", patient.patientCode);
    };
    load();
  }, [recordDetail?.patientId]);

  //  Khi có patientCode → gọi queue search
  useEffect(() => {
    if (patientCode) {
      console.log("📨 Gửi filter patientCode:", patientCode);
      updateFilters({ patientCode });
    }
  }, [patientCode]);

  // 👉 Khi có kết quả queue
  useEffect(() => {
    console.log("📦 Danh sách queuePatients:", queuePatients);
    if (queuePatients.length > 0) {
      console.log("📥 Kết quả QueuePatients:", queuePatients);
      setSelectedQueuePatient(queuePatients[0]);
    } else {
      console.log("⚠️ Không có queuePatient nào tìm thấy");
    }
  }, [queuePatients]);

  // 👉 Filter fields cho bên trái
  const filterFields: FilterField[] = [
    {
      key: "patientId",
      label: "Tên bệnh nhân",
      customRender: ({ value, onChange, loading }) => {
        const [inputValue, setInputValue] = useState("");
        const [searchTerm, setSearchTerm] = useState("");
        const { options: searchOptions } = useSearchPatients(searchTerm);

        useEffect(() => {
          const found = searchOptions.find((opt) => opt.value === value);
          if (found) setInputValue(found.label);
        }, [value, searchOptions]);

        return (
          <FloatingLabelWrapper label="Tên bệnh nhân">
            <Autocomplete
              placeholder="Nhập tên bệnh nhân"
              data={searchOptions}
              value={inputValue}
              onChange={(val) => {
                const selected = searchOptions.find((opt) => opt.label === val);
                if (selected) {
                  setInputValue(selected.label);
                  onChange(selected.value);
                } else {
                  setInputValue(val);
                  onChange("");
                }
              }}
              onInput={(e) => {
                setInputValue(e.currentTarget.value);
                setSearchTerm(e.currentTarget.value);
              }}
              disabled={loading}
              clearable
            />
          </FloatingLabelWrapper>
        );
      },
    },
    {
      key: "medicalRecordCode",
      label: "Mã hồ sơ",
      type: "text",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "fromDate",
      label: "Từ ngày",
      type: "date",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "toDate",
      label: "Đến ngày",
      type: "date",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      wrapper: FloatingLabelWrapper,
      options: Object.entries(MedicalRecordStatusMap).map(([value, label]) => ({
        value,
        label,
      })),
    },
  ];

  const handleSearch = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      patientId: "",
      medicalRecordCode: "",
      fromDate: new Date(),
      toDate: new Date(),
      status: MedicalRecordStatus.TESTING,
    });
    setPage(1);
    setFilterKey((prev) => prev + 1);
  };

  const handleSelectOrder = (order: MedicalRecordOrder) => {
    setSelectedOrder(order);
    setIsResultMode(true);
  };

  const handleCloseOrder = () => {
    setSelectedOrder(null);
    setIsResultMode(false);
  };

  const displayedRecords = records;

  const filteredOrders = useMemo(
    () => new Set(departmentOrders.map((o) => o.orderId)),
    [departmentOrders]
  );

  const pendingOrders = useMemo(
    () =>
      recordDetail?.orders.filter(
        (o) => o.status !== "COMPLETED" && filteredOrders.has(o.id)
      ) ?? [],
    [recordDetail?.orders, filteredOrders]
  );

  const doneOrders =
    recordDetail?.orders.filter((o) => o.status === "COMPLETED") ?? [];

  // 👉 Render

  return (
    <Grid>
      <Grid.Col span={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
        <Text
          fw={700}
          c="red"
          size="lg"
          style={{
            marginTop: 0,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          {department?.roomNumber} – {department?.name}
        </Text>
      </Grid.Col>
      {/* FILTER SECTION */}
      <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
        <Paper shadow="xs" p="md" radius={0} mb="md" withBorder>
          <Title order={5} mb="sm">
            Bộ lọc hồ sơ
          </Title>
          <FilterPanel
            key={filterKey}
            fields={filterFields}
            initialValues={filters}
            onSearch={handleSearch}
            onReset={handleReset}
          />
          <Divider mt="md" mb={15} />
          <Title order={5} mb="md">
            Danh sách hồ sơ
          </Title>
          <ClinicList
            records={displayedRecords}
            loading={loading}
            selectedRecordId={selectedRecordId}
            setSelectedRecordId={setSelectedRecordId}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pagination={pagination}
          />
        </Paper>
      </Grid.Col>

      {/* DETAIL VIEW SECTION */}
      <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
        <Paper shadow="xs" p="md" radius={0} mb="md" withBorder>
          <Title order={5} mb="xs">
            Thông tin khám & thực hiện dịch vụ
          </Title>
          <HeaderBar
            selectedOrder={selectedOrder}
            isResultMode={isResultMode}
            onSelectInfo={() => setIsResultMode(false)}
            onViewResult={() => setIsResultMode(true)}
            onCloseOrder={handleCloseOrder}
          />

          {selectedOrder && isResultMode ? (
            <ServiceResultPanel
              medicalOrderId={selectedOrder.id}
              serviceName={selectedOrder.serviceName}
              technicalId={userInfo?.userId || ""}
              technicalName={technicalName}
              onSubmit={async () => {
                await fetchMedicalRecordDetail(selectedRecordId!);
                handleCloseOrder();
              }}
              onCancel={handleCloseOrder}
            />
          ) : (
            <>
              <PatientInfoPanel patient={selectedQueuePatient} />
              <ServiceExecutionPanel
                pendingServices={pendingOrders}
                doneServices={doneOrders}
                onAction={handleSelectOrder}
                recordStatus={recordDetail?.status as MedicalRecordStatus}
              />
            </>
          )}
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default ClinicalPage;
