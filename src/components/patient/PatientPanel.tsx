import { useEffect, useMemo, useState } from "react";
import { Divider, Group, Paper, Text } from "@mantine/core";
import dayjs from "dayjs";

import FilterPanel, { FilterField } from "../common/FilterSection";
import WaitingPatientList from "./WaitingPatientList";
import InProgressPatientList from "./InProgressPatientList";
import { Status, StatusLabel } from "../../enums/Queue-Patient/Status";
import { MedicalRecordStatus } from "../../enums/MedicalRecord/MedicalRecordStatus";
import useMedicalRecordByRoom from "../../hooks/medicalRecord/useMedicalRecordByRoom";

import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";
import { FloatingLabelWrapper } from "../common/FloatingLabelWrapper";

interface PatientPanelProps {
  selectedQueuePatient: QueuePatient | null;
  selectedMedicalRecord: MedicalRecord | null;
  onSelectQueuePatient: (p: QueuePatient) => void;
  onSelectMedicalRecord: (r: MedicalRecord) => void;
  patients: QueuePatient[];
  totalElements: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
  department?: DepartmentResponse | null;
  updateFilters: (filters: any) => void;
  onSwitchListReset: () => void;
  onTabChange?: (tab: "waiting" | "inprogress") => void;
}

const PatientPanel = ({
  selectedQueuePatient,
  selectedMedicalRecord,
  onSelectQueuePatient,
  onSelectMedicalRecord,
  patients,
  totalElements,
  pageSize,
  currentPage,
  loading,
  setPageSize,
  setCurrentPage,
  department,
  updateFilters,
  onSwitchListReset,
  onTabChange,
}: PatientPanelProps) => {
  const [activeTab, setActiveTab] = useState<"waiting" | "inprogress">(
    "waiting"
  );
  const [hasFetchedInprogress, setHasFetchedInprogress] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(Date.now());
  const today = new Date();
  const todayStr = dayjs().format("YYYY-MM-DD");

  const {
    records,
    loading: medicalLoading,
    pagination,
    fetchMedicalRecordsByRoom,
  } = useMedicalRecordByRoom();

  const [sharedDateFilters, setSharedDateFilters] = useState({
    fromDate: today,
    toDate: today,
  });

  const allowedStatuses: Status[] = [
    Status.WAITING,
    Status.DONE,
    Status.CANCELED,
    Status.IN_PROGRESS,
    Status.CALLING,
    Status.AWAITING_RESULT,
  ];

  const baseFilterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên bệnh nhân",
      type: "text",
      placeholder: "Nhập tên...",
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "phone",
      label: "SĐT",
      type: "text",
      placeholder: "Nhập số điện thoại...",
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
  ];

  const waitingOnlyFields: FilterField[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      type: "select",
      options: allowedStatuses.map((status) => ({
        value: status,
        label: StatusLabel[status],
      })),
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "patientCode",
      label: "Mã BN",
      type: "text",
      placeholder: "Nhập mã bệnh nhân...",
      wrapper: FloatingLabelWrapper,
    },
  ];

  const inprogressOnlyFields: FilterField[] = [
    {
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      type: "select",
      options: Object.values(MedicalRecordStatus).map((status) => ({
        value: status,
        label: status,
      })),
      wrapper: FloatingLabelWrapper,
    },
    {
      key: "medicalRecordCode",
      label: "Mã hồ sơ",
      type: "text",
      placeholder: "Nhập mã hồ sơ...",
      wrapper: FloatingLabelWrapper,
    },
  ];

  const filterFields =
    activeTab === "waiting"
      ? [...waitingOnlyFields, ...baseFilterFields]
      : [...inprogressOnlyFields, ...baseFilterFields];

  const initialFilters = {
    name: "",
    phone: "",
    fromDate: sharedDateFilters.fromDate,
    toDate: sharedDateFilters.toDate,
    status: "",
    patientCode: "",
    medicalRecordCode: "",
  };

  const toDateStringSafe = (value: any) => {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if (value instanceof Date) return dayjs(value).format("YYYY-MM-DD");
    return undefined;
  };

  const handleSearch = (filters: any) => {
    const { name, phone, fromDate, toDate, ...rest } = filters;

    setSharedDateFilters({
      fromDate: fromDate ?? today,
      toDate: toDate ?? today,
    });

    const waitingFilters = {
      ...rest,
      name,
      phone,
      registeredTimeFrom: toDateStringSafe(fromDate) ?? todayStr,
      registeredTimeTo: toDateStringSafe(toDate) ?? todayStr,
      roomNumber: department?.roomNumber,
    };

    const inprogressFilters = {
      ...rest,
      patientName: name,
      patientPhone: phone,
      fromDate: toDateStringSafe(fromDate) ?? todayStr,
      toDate: toDateStringSafe(toDate) ?? todayStr,
      roomNumber: department?.roomNumber ?? "",
    };

    updateFilters(waitingFilters);
    fetchMedicalRecordsByRoom(inprogressFilters);
  };

  const handleReset = () => {
    setSharedDateFilters({
      fromDate: today,
      toDate: today,
    });
    setResetTrigger(Date.now());
    updateFilters({
      name: "",
      phone: "",
      patientCode: "",
      status: "",
      registeredTimeFrom: todayStr,
      registeredTimeTo: todayStr,
      roomNumber: department?.roomNumber,
    });

    fetchMedicalRecordsByRoom({
      patientName: "",
      patientPhone: "",
      medicalRecordCode: "",
      status: "",
      fromDate: todayStr,
      toDate: todayStr,
      roomNumber: department?.roomNumber ?? "",
    });
  };

  useEffect(() => {
    if (
      activeTab === "inprogress" &&
      department?.roomNumber &&
      !hasFetchedInprogress
    ) {
      fetchMedicalRecordsByRoom({
        roomNumber: department.roomNumber,
        fromDate: todayStr,
        toDate: todayStr,
        status: `${MedicalRecordStatus.TESTING},${MedicalRecordStatus.WAITING_FOR_RESULT}`,
      });
      setHasFetchedInprogress(true);
    }
  }, [activeTab, department?.roomNumber, hasFetchedInprogress]);

  const filteredPatients = useMemo(() => patients, [patients]);

  return (
    <Paper p="md" shadow="xs" withBorder radius={0}>
      <div className="flex flex-col">
        <FilterPanel
          fields={filterFields}
          resetTrigger={resetTrigger}
          initialValues={initialFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <Divider mt="md" mb={15} />

        <Group justify="center" mb="md">
          <Text
            fw={activeTab === "waiting" ? 700 : 400}
            td={activeTab === "waiting" ? "underline" : "none"}
            c={activeTab === "waiting" ? "blue" : "gray"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("waiting");
              onTabChange?.("waiting");
              onSwitchListReset();
            }}
          >
            Danh sách chờ khám
          </Text>
          <Divider orientation="vertical" mx="sm" />
          <Text
            fw={activeTab === "inprogress" ? 700 : 400}
            td={activeTab === "inprogress" ? "underline" : "none"}
            c={activeTab === "inprogress" ? "blue" : "gray"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("inprogress");
              onTabChange?.("inprogress");
              onSwitchListReset();
            }}
          >
            Danh sách chờ kết quả
          </Text>
        </Group>

        {activeTab === "waiting" ? (
          <WaitingPatientList
            patients={filteredPatients}
            selectedPatient={selectedQueuePatient}
            onSelectPatient={onSelectQueuePatient}
            pageSize={pageSize}
            currentPage={currentPage}
            totalElements={totalElements}
            loading={loading}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
          />
        ) : (
          <InProgressPatientList
            records={records}
            loading={medicalLoading}
            pagination={pagination}
            fetchMedicalRecords={() =>
              fetchMedicalRecordsByRoom({
                roomNumber: department?.roomNumber ?? "",
                page: pagination.pageNumber,
                size: pagination.pageSize,
                fromDate: todayStr,
                toDate: todayStr,
                status: `${MedicalRecordStatus.TESTING},${MedicalRecordStatus.WAITING_FOR_RESULT}`,
              })
            }
            selectedId={selectedMedicalRecord?.id ?? null}
            onSelect={onSelectMedicalRecord}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            roomNumber={department?.roomNumber ?? ""}
          />
        )}
      </div>
    </Paper>
  );
};

export default PatientPanel;
