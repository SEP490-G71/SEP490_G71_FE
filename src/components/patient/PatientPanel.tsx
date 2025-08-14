import { useEffect, useMemo, useState, useCallback } from "react";
import { Divider, Group, Paper, Text } from "@mantine/core";
import dayjs from "dayjs";

import FilterPanel, { FilterField } from "../common/FilterSection";
import WaitingPatientList from "./WaitingPatientList";
import InProgressPatientList from "./InProgressPatientList";
import TranferPatientList from "./TranferPatientList";

import { Status, StatusLabel } from "../../enums/Queue-Patient/Status";
import {
  MedicalRecordStatus,
  MedicalRecordStatusMap,
} from "../../enums/MedicalRecord/MedicalRecordStatus";

import useMedicalRecordByRoom from "../../hooks/medicalRecord/useMedicalRecordByRoom";
import { useRoomTransfers } from "../../hooks/TransferRoom/useRoomTransfersFilter";

import { QueuePatient } from "../../types/Queue-patient/QueuePatient";
import { MedicalRecord } from "../../types/MedicalRecord/MedicalRecord";
import { DepartmentResponse } from "../../types/Admin/Department/DepartmentTypeResponse";
import { FloatingLabelWrapper } from "../common/FloatingLabelWrapper";

interface PatientPanelProps {
  selectedQueuePatient: QueuePatient | null;
  selectedMedicalRecordInprogress: MedicalRecord | null;
  selectedMedicalRecordTransfer: MedicalRecord | null;
  onSelectMedicalRecordInprogress: (r: MedicalRecord) => void;
  onSelectMedicalRecordTransfer: (r: MedicalRecord) => void;
  onSelectQueuePatient: (p: QueuePatient) => void;
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
  onTabChange?: (tab: "waiting" | "inprogress" | "transfers") => void;
  onQueueStatusChanged?: (id: string, status: Status) => void;
}

const PatientPanel = ({
  selectedQueuePatient,
  selectedMedicalRecordInprogress,
  selectedMedicalRecordTransfer,
  onSelectMedicalRecordInprogress,
  onSelectMedicalRecordTransfer,
  onSelectQueuePatient,
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
  onQueueStatusChanged,
}: PatientPanelProps) => {
  const [activeTab, setActiveTab] = useState<
    "waiting" | "inprogress" | "transfers"
  >("waiting");
  const [resetTrigger, setResetTrigger] = useState(Date.now());
  const [hasFetchedInprogress, setHasFetchedInprogress] = useState(false);
  const [hasFetchedTransfers, setHasFetchedTransfers] = useState(false);

  const today = new Date();
  const todayStr = dayjs().format("YYYY-MM-DD");

  const [sharedDateFilters, setSharedDateFilters] = useState({
    fromDate: today,
    toDate: today,
  });

  const {
    records,
    loading: medicalLoading,
    pagination,
    fetchMedicalRecordsByRoom,
  } = useMedicalRecordByRoom();

  const {
    rows: transferRows,
    totalItems: transferTotal,
    loading: transferLoading,
    fetchRoomTransfers,
  } = useRoomTransfers();

  const [transferPage, setTransferPage] = useState(1);
  const [transferPageSize, setTransferPageSize] = useState(10);

  const inprogressBase = useMemo(
    () => ({
      roomNumber: department?.roomNumber ?? "",
      fromDate: dayjs(sharedDateFilters.fromDate).format("YYYY-MM-DD"),
      toDate: dayjs(sharedDateFilters.toDate).format("YYYY-MM-DD"),
      status: `${MedicalRecordStatus.TESTING},${MedicalRecordStatus.WAITING_FOR_RESULT}`,
    }),
    [department?.roomNumber, sharedDateFilters]
  );

  const transferDateRange = useMemo(
    () => ({
      fromDate: dayjs(sharedDateFilters.fromDate).format("YYYY-MM-DD"),
      toDate: dayjs(sharedDateFilters.toDate).format("YYYY-MM-DD"),
    }),
    [sharedDateFilters]
  );

  const handleInprogressPageChange = useCallback(
    (page: number) =>
      fetchMedicalRecordsByRoom({
        ...inprogressBase,
        page,
        size: pagination.pageSize,
      }),
    [fetchMedicalRecordsByRoom, inprogressBase, pagination.pageSize]
  );

  const handleInprogressPageSizeChange = useCallback(
    (size: number) =>
      fetchMedicalRecordsByRoom({
        ...inprogressBase,
        page: 0,
        size,
      }),
    [fetchMedicalRecordsByRoom, inprogressBase]
  );

  const fetchTransfers = useCallback(
    (page: number, size: number) => {
      if (!department?.id) return;
      fetchRoomTransfers({
        page: page - 1,
        size,
        toDepartmentId: department.id,
        ...transferDateRange,
      });
    },
    [department?.id, fetchRoomTransfers, transferDateRange]
  );

  const onTransferPageChange = (p: number) => {
    setTransferPage(p);
    fetchTransfers(p, transferPageSize);
  };

  const onTransferPageSizeChange = (s: number) => {
    setTransferPageSize(s);
    setTransferPage(1);
    fetchTransfers(1, s);
  };

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

  const baseFilterFieldsWithoutPhone: FilterField[] = [
    {
      key: "name",
      label: "Tên bệnh nhân",
      type: "text",
      placeholder: "Nhập tên...",
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
        label: MedicalRecordStatusMap[status],
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

  const transferOnlyFields: FilterField[] = [
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
      : activeTab === "inprogress"
      ? [...inprogressOnlyFields, ...baseFilterFields]
      : [...transferOnlyFields, ...baseFilterFieldsWithoutPhone]; // transfers: bỏ phone

  const toDateStringSafe = (value: any) => {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if (value instanceof Date) return dayjs(value).format("YYYY-MM-DD");
    return undefined;
  };

  const handleSearch = (filters: any) => {
    const {
      name,
      phone,
      fromDate,
      toDate,
      medicalRecordCode,
      status,
      patientCode,
    } = filters;

    setSharedDateFilters({
      fromDate: fromDate ?? today,
      toDate: toDate ?? today,
    });

    const commonDates = {
      fromDate: toDateStringSafe(fromDate) ?? todayStr,
      toDate: toDateStringSafe(toDate) ?? todayStr,
    };

    if (activeTab === "waiting") {
      updateFilters({
        name,
        phone,
        patientCode,
        status,
        registeredTimeFrom: commonDates.fromDate,
        registeredTimeTo: commonDates.toDate,
        roomNumber: department?.roomNumber,
      });
    } else if (activeTab === "inprogress") {
      fetchMedicalRecordsByRoom({
        patientName: name,
        patientPhone: phone,
        medicalRecordCode,
        status,
        ...commonDates,
        roomNumber: department?.roomNumber ?? "",
      });
    } else {
      if (!department?.id) return;
      setTransferPage(1);
      fetchRoomTransfers({
        page: 0,
        size: transferPageSize,
        toDepartmentId: department.id,
        medicalRecordCode,
        ...commonDates,
      });
    }
  };

  const handleReset = () => {
    setSharedDateFilters({ fromDate: today, toDate: today });
    setResetTrigger(Date.now());

    if (activeTab === "waiting") {
      updateFilters({
        name: "",
        phone: "",
        patientCode: "",
        status: "",
        registeredTimeFrom: todayStr,
        registeredTimeTo: todayStr,
        roomNumber: department?.roomNumber,
      });
    } else if (activeTab === "inprogress") {
      fetchMedicalRecordsByRoom({
        patientName: "",
        patientPhone: "",
        medicalRecordCode: "",
        status: "",
        fromDate: todayStr,
        toDate: todayStr,
        roomNumber: department?.roomNumber ?? "",
      });
    } else {
      if (!department?.id) return;
      setTransferPage(1);
      fetchRoomTransfers({
        page: 0,
        size: transferPageSize,
        toDepartmentId: department.id,
        fromDate: todayStr,
        toDate: todayStr,
      });
    }
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
  }, [
    activeTab,
    department?.roomNumber,
    hasFetchedInprogress,
    fetchMedicalRecordsByRoom,
    todayStr,
  ]);

  // Lần đầu mở tab “Chuyển vào”
  useEffect(() => {
    if (activeTab === "transfers" && department?.id && !hasFetchedTransfers) {
      fetchTransfers(1, transferPageSize);
      setHasFetchedTransfers(true);
    }
  }, [
    activeTab,
    department?.id,
    hasFetchedTransfers,
    fetchTransfers,
    transferPageSize,
  ]);

  // ===== Derived
  const filteredPatients = useMemo(() => patients, [patients]);

  return (
    <Paper p="md" shadow="xs" withBorder radius={0}>
      <div className="flex flex-col">
        <FilterPanel
          fields={filterFields}
          resetTrigger={resetTrigger}
          initialValues={{
            name: "",
            phone: "",
            fromDate: sharedDateFilters.fromDate,
            toDate: sharedDateFilters.toDate,
            status: "",
            patientCode: "",
            medicalRecordCode: "",
          }}
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
            Chờ khám
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
            Chờ kết quả
          </Text>

          <Divider orientation="vertical" mx="sm" />

          <Text
            fw={activeTab === "transfers" ? 700 : 400}
            td={activeTab === "transfers" ? "underline" : "none"}
            c={activeTab === "transfers" ? "blue" : "gray"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setActiveTab("transfers");
              onTabChange?.("transfers");
              onSwitchListReset();
            }}
          >
            Chuyển vào
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
            onStatusChanged={onQueueStatusChanged}
          />
        ) : activeTab === "inprogress" ? (
          <InProgressPatientList
            records={records}
            loading={medicalLoading}
            currentPage={pagination.pageNumber}
            pageSize={pagination.pageSize}
            totalElements={pagination.totalElements}
            selectedId={selectedMedicalRecordInprogress?.id ?? null}
            onSelect={onSelectMedicalRecordInprogress}
            setCurrentPage={handleInprogressPageChange}
            setPageSize={handleInprogressPageSizeChange}
          />
        ) : (
          <TranferPatientList
            rows={transferRows}
            page={transferPage}
            pageSize={transferPageSize}
            totalItems={transferTotal}
            loading={transferLoading}
            onPageChange={onTransferPageChange}
            onPageSizeChange={onTransferPageSizeChange}
            selectedId={selectedMedicalRecordTransfer?.id ?? null}
            onRowClick={(row) => {
              if (row.medicalRecordId) {
                onSelectMedicalRecordTransfer({
                  id: row.medicalRecordId,
                } as any);
              }
            }}
          />
        )}
      </div>
    </Paper>
  );
};

export default PatientPanel;
