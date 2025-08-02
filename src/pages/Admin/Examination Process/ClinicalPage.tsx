import { Autocomplete, Divider, Grid, Paper, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
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
import useStaffs from "../../../hooks/staffs-service/useStaffs";
import useMyDepartment from "../../../hooks/department-service/useMyDepartment";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";
import { useSearchPatients } from "../../../hooks/Patient-Management/useSearchPatients";
import { MedicalRecordOrder } from "../../../types/MedicalRecord/MedicalRecordDetail";
import { QueuePatient } from "../../../types/Queue-patient/QueuePatient";
import {
  MedicalRecordStatus,
  MedicalRecordStatusMap,
} from "../../../enums/MedicalRecord/MedicalRecordStatus";
import { MedicalRecord } from "../../../types/MedicalRecord/MedicalRecord";
import { mapDetailToQueuePatient } from "../../../components/common/patient.mapper";

const ClinicalPage = () => {
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

  const [selectedQueuePatient, setSelectedQueuePatient] =
    useState<QueuePatient | null>(null);

  const { userInfo } = useUserInfo();
  const { fetchStaffsById } = useStaffs();
  const { department } = useMyDepartment();

  const { orders: departmentOrders } = useMedicalOrdersByDepartment(
    department?.id || ""
  );
  const { records, loading, pagination, fetchMedicalRecords } =
    useMedicalRecordList();
  const { recordDetail, fetchMedicalRecordDetail } = useMedicalRecordDetail();

  const [technicalName, setTechnicalName] = useState("Không rõ");

  useEffect(() => {
    const fetch = async () => {
      if (userInfo?.userId) {
        const data = await fetchStaffsById(userInfo.userId);
        if (data) setTechnicalName(data.fullName || "Không rõ");
      }
    };
    fetch();
  }, [userInfo?.userId]);

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
      placeholder: "Nhập mã hồ sơ",
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

  useEffect(() => {
    if (selectedRecordId && recordDetail?.id === selectedRecordId) {
      const mapped = mapDetailToQueuePatient(recordDetail);
      setSelectedQueuePatient(mapped);
    }
  }, [recordDetail, selectedRecordId]);

  const handleSelectRecordAndPatient = async (record: MedicalRecord) => {
    setSelectedRecordId(record.id);
    await fetchMedicalRecordDetail(record.id);
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
    recordDetail?.orders.filter(
      (o) => o.status === "COMPLETED" && filteredOrders.has(o.id)
    ) ?? [];
  const mapResultToInitialResult = (result: any) => ({
    id: result?.id,
    completedBy: result?.completedBy ?? "",
    imageUrls: result?.imageUrls ?? [],
    note: result?.note ?? "",
    description: result?.description ?? "",
  });
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
            onSelectRecordAndPatient={handleSelectRecordAndPatient}
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
          <HeaderBar
            selectedOrder={selectedOrder}
            isResultMode={isResultMode}
            onSelectInfo={() => setIsResultMode(false)}
            onViewResult={() => setIsResultMode(true)}
            onCloseOrder={handleCloseOrder}
          />

          <div style={{ display: isResultMode ? "none" : "block" }}>
            <PatientInfoPanel patient={selectedQueuePatient} />
            <ServiceExecutionPanel
              pendingServices={pendingOrders}
              doneServices={doneOrders}
              onAction={handleSelectOrder}
              recordStatus={recordDetail?.status as MedicalRecordStatus}
            />
          </div>

          <div style={{ display: isResultMode ? "block" : "none" }}>
            {selectedOrder && (
              <ServiceResultPanel
                medicalOrderId={selectedOrder.id}
                serviceName={selectedOrder.serviceName}
                technicalId={userInfo?.userId || ""}
                technicalName={technicalName}
                initialResult={
                  selectedOrder.results && selectedOrder.results.length > 0
                    ? mapResultToInitialResult(selectedOrder.results[0])
                    : undefined
                }
                onSubmit={async () => {
                  await fetchMedicalRecordDetail(selectedRecordId!);
                  handleCloseOrder();
                }}
                onCancel={handleCloseOrder}
              />
            )}
          </div>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default ClinicalPage;
