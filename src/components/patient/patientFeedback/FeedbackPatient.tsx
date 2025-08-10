import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  Text,
  Group,
  Stack,
  Loader,
  Alert,
  Badge,
  Divider,
  Paper,
  Collapse,
} from "@mantine/core";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { MedicalRecord } from "../../../types/MedicalRecord/MedicalRecord";
import { StaffFeedbackItem } from "../../../types/Admin/Feedback/StaffFeedback";
import { useFeedbackStaffs } from "../../../hooks/medicalRecord/feedBack/useFeedbackStaffs";
import { useFeedbackServices } from "../../../hooks/medicalRecord/feedBack/useFeedbackServices";
import {
  SatisfactionLevel,
  SatisfactionLevelMap,
} from "../../../enums/FeedBack/SatisfactionLevel";
import { useUpdateStaffFeedback } from "../../../hooks/feedBack/StaffFeedBack/useUpdateStaffFeedback";
import { useUpdateMedicalServiceFeedback } from "../../../hooks/feedBack/ServiceFeedBack/updateMedicalServiceFeedback";

import useStaffFeedbackByRecord, {
  StaffFeedbackByRecordItem,
} from "../../../hooks/feedBack/StaffFeedBack/useStaffFeedbackByRecord";
import useMedicalServiceFeedbackByRecord, {
  MedicalServiceFeedbackByRecordItem,
} from "../../../hooks/feedBack/ServiceFeedBack/useMedicalServiceFeedbackByRecord";

import { RatingRow } from "../../admin/Feedback/userFeedback/RatingRow";
import { HistoryList } from "../../admin/Feedback/userFeedback/HistoryList";

type Option = { value: SatisfactionLevel; label: string };

export interface FeedbackPatientProps {
  opened: boolean;
  onClose: () => void;
  record?: MedicalRecord | null;
  medicalRecordId?: string;
  patientId?: string;
  onSubmit?: (payload: any) => Promise<void> | void;
  titlePrefix?: string;
}

type LineState = {
  level: SatisfactionLevel | null;
  comment: string;
  sending: boolean;
};

const defaultLineState: LineState = {
  level: null,
  comment: "",
  sending: false,
};

const FeedbackPatient = ({
  opened,
  onClose,
  record,
  medicalRecordId,
  patientId,
  onSubmit,
  titlePrefix = "Góp ý cho hồ sơ",
}: FeedbackPatientProps) => {
  const mrId = medicalRecordId ?? (record?.id as string | undefined);
  const pid = patientId ?? ((record as any)?.patientId as string | undefined);

  const levelOptions: Option[] = useMemo(
    () =>
      (Object.values(SatisfactionLevel) as SatisfactionLevel[]).map((lv) => ({
        value: lv,
        label: SatisfactionLevelMap[lv],
      })),
    []
  );

  const {
    data: staffs,
    loading: loadingStaffs,
    error: errorStaffs,
    refetch: refetchStaffs,
  } = useFeedbackStaffs(opened ? mrId : undefined);

  const staffRows = useMemo(() => {
    const safe = Array.isArray(staffs) ? staffs : [];
    return safe
      .map((s: any) => ({
        staffId: s?.staffId ?? s?.id ?? "",
        name: s?.staffName ?? s?.fullName ?? "",
        staffCode: s?.staffCode ?? "",
        role: s?.role ?? "",
      }))
      .filter((x) => x.staffId && x.name);
  }, [staffs]);

  const {
    data: medicalTargets,
    loading: loadingMedical,
    error: errorMedical,
    refetch: refetchMedical,
  } = useFeedbackServices(opened ? mrId : undefined);

  const serviceRows = useMemo(() => {
    const safe = Array.isArray(medicalTargets) ? medicalTargets : [];
    return safe
      .map((m: any) => ({
        serviceId: m?.serviceId ?? m?.id ?? "",
        name: m?.serviceName ?? m?.name ?? "",
      }))
      .filter((x) => x.serviceId && x.name);
  }, [medicalTargets]);

  const [staffState, setStaffState] = useState<Record<string, LineState>>({});
  const [openStaff, setOpenStaff] = useState<Record<string, boolean>>({});
  const [staffFeedbackLists, setStaffFeedbackLists] = useState<
    Record<string, StaffFeedbackItem[]>
  >({});
  const [loadingStaffFeedback, setLoadingStaffFeedback] = useState<
    Record<string, boolean>
  >({});
  const [fetchedStaff, setFetchedStaff] = useState<Record<string, boolean>>({});
  const [existingStaffFbId, setExistingStaffFbId] = useState<
    Record<string, string | undefined>
  >({});

  const { updateStaffFeedback, loading: updatingStaffFb } =
    useUpdateStaffFeedback();

  const {
    feedbacks: staffFeedbackAll,
    loading: loadingStaffByRecord,
    error: errorStaffByRecord,
    fetchByRecordId: fetchStaffByRecordId,
    reset: resetStaffByRecord,
  } = useStaffFeedbackByRecord();

  const [serviceState, setServiceState] = useState<Record<string, LineState>>(
    {}
  );
  const [openService, setOpenService] = useState<Record<string, boolean>>({});
  const [serviceFeedbackLists, setServiceFeedbackLists] = useState<
    Record<string, MedicalServiceFeedbackByRecordItem[]>
  >({});
  const [loadingServiceFeedback, setLoadingServiceFeedback] = useState<
    Record<string, boolean>
  >({});
  const [fetchedService, setFetchedService] = useState<Record<string, boolean>>(
    {}
  );
  const [existingServiceFbId, setExistingServiceFbId] = useState<
    Record<string, string | undefined>
  >({});

  const { updateMedicalServiceFeedback, loading: updatingServiceFb } =
    useUpdateMedicalServiceFeedback();

  const {
    feedbacks: serviceFeedbackAll,
    loading: loadingServiceByRecord,
    error: errorServiceByRecord,
    fetchByRecordId: fetchServiceByRecordId,
    reset: resetServiceByRecord,
  } = useMedicalServiceFeedbackByRecord();

  const buildStaffListFromAll = (
    all: StaffFeedbackByRecordItem[],
    staffId: string
  ): StaffFeedbackItem[] => {
    const filtered = (all || []).filter((x) => x.doctorId === staffId);
    return filtered as unknown as StaffFeedbackItem[];
  };

  const buildServiceListFromAll = (
    all: MedicalServiceFeedbackByRecordItem[],
    serviceId: string
  ): MedicalServiceFeedbackByRecordItem[] => {
    return (all || []).filter((x) => x.medicalServiceId === serviceId);
  };

  const loadStaffFeedbacks = async (staffId: string) => {
    try {
      setLoadingStaffFeedback((p) => ({ ...p, [staffId]: true }));

      const list = buildStaffListFromAll(staffFeedbackAll, staffId);
      setStaffFeedbackLists((p) => ({ ...p, [staffId]: list || [] }));
      setFetchedStaff((p) => ({ ...p, [staffId]: true }));

      if (pid && mrId) {
        const mine = (list || [])
          .filter(
            (fb: any) => fb?.patientId === pid && fb?.medicalRecordId === mrId
          )
          .sort(
            (a: any, b: any) =>
              (dayjs(b?.createdAt).valueOf() || 0) -
              (dayjs(a?.createdAt).valueOf() || 0)
          );

        if (mine.length > 0) {
          const latest: any = mine[0];
          setExistingStaffFbId((p) => ({ ...p, [staffId]: latest.id }));
          setStaffState((prev) => ({
            ...prev,
            [staffId]: {
              ...(prev[staffId] ?? defaultLineState),
              level: latest?.satisfactionLevel as SatisfactionLevel,
              comment: latest?.comment ?? "",
              sending: false,
            },
          }));
        } else {
          setExistingStaffFbId((p) => ({ ...p, [staffId]: undefined }));
        }
      }
    } finally {
      setLoadingStaffFeedback((p) => ({ ...p, [staffId]: false }));
    }
  };

  const loadServiceFeedbacks = async (serviceId: string) => {
    try {
      setLoadingServiceFeedback((p) => ({ ...p, [serviceId]: true }));

      const list = buildServiceListFromAll(serviceFeedbackAll, serviceId);
      setServiceFeedbackLists((p) => ({ ...p, [serviceId]: list || [] }));
      setFetchedService((p) => ({ ...p, [serviceId]: true }));

      if (pid && mrId) {
        const mine = (list || [])
          .filter(
            (fb: any) => fb?.patientId === pid && fb?.medicalRecordId === mrId
          )
          .sort(
            (a: any, b: any) =>
              (dayjs(b?.createdAt).valueOf() || 0) -
              (dayjs(a?.createdAt).valueOf() || 0)
          );

        if (mine.length > 0) {
          const latest: any = mine[0];
          setExistingServiceFbId((p) => ({ ...p, [serviceId]: latest.id }));
          setServiceState((prev) => ({
            ...prev,
            [serviceId]: {
              ...(prev[serviceId] ?? defaultLineState),
              level: latest?.satisfactionLevel as SatisfactionLevel,
              comment: latest?.comment ?? "",
              sending: false,
            },
          }));
        } else {
          setExistingServiceFbId((p) => ({ ...p, [serviceId]: undefined }));
        }
      }
    } finally {
      setLoadingServiceFeedback((p) => ({ ...p, [serviceId]: false }));
    }
  };

  useEffect(() => {
    if (!opened) return;

    Object.keys(openStaff).forEach((sid) => {
      if (!openStaff[sid]) return;
      const list = buildStaffListFromAll(staffFeedbackAll, sid);
      setStaffFeedbackLists((p) => ({ ...p, [sid]: list || [] }));
      if (pid && mrId) {
        const mine = (list || [])
          .filter((fb) => fb?.patientId === pid && fb?.medicalRecordId === mrId)
          .sort(
            (a: any, b: any) =>
              (dayjs(b?.createdAt).valueOf() || 0) -
              (dayjs(a?.createdAt).valueOf() || 0)
          );
        if (mine.length > 0) {
          const latest: any = mine[0];
          setExistingStaffFbId((p) => ({ ...p, [sid]: latest.id }));
          setStaffState((prev) => ({
            ...prev,
            [sid]: {
              ...(prev[sid] ?? defaultLineState),
              level: latest?.satisfactionLevel as SatisfactionLevel,
              comment: latest?.comment ?? "",
              sending: false,
            },
          }));
        } else {
          setExistingStaffFbId((p) => ({ ...p, [sid]: undefined }));
        }
      }
    });

    Object.keys(openService).forEach((svId) => {
      if (!openService[svId]) return;
      const list = buildServiceListFromAll(serviceFeedbackAll, svId);
      setServiceFeedbackLists((p) => ({ ...p, [svId]: list || [] }));
      if (pid && mrId) {
        const mine = (list || [])
          .filter((fb) => fb?.patientId === pid && fb?.medicalRecordId === mrId)
          .sort(
            (a: any, b: any) =>
              (dayjs(b?.createdAt).valueOf() || 0) -
              (dayjs(a?.createdAt).valueOf() || 0)
          );
        if (mine.length > 0) {
          const latest: any = mine[0];
          setExistingServiceFbId((p) => ({ ...p, [svId]: latest.id }));
          setServiceState((prev) => ({
            ...prev,
            [svId]: {
              ...(prev[svId] ?? defaultLineState),
              level: latest?.satisfactionLevel as SatisfactionLevel,
              comment: latest?.comment ?? "",
              sending: false,
            },
          }));
        } else {
          setExistingServiceFbId((p) => ({ ...p, [svId]: undefined }));
        }
      }
    });
  }, [opened, staffFeedbackAll, serviceFeedbackAll]);

  useEffect(() => {
    if (!opened || !mrId) return;

    setStaffState({});
    setServiceState({});
    setOpenStaff({});
    setOpenService({});
    setStaffFeedbackLists({});
    setFetchedStaff({});
    setLoadingStaffFeedback({});
    setExistingStaffFbId({});

    setServiceFeedbackLists({});
    setFetchedService({});
    setLoadingServiceFeedback({});
    setExistingServiceFbId({});

    refetchStaffs();
    refetchMedical();

    fetchStaffByRecordId(mrId);
    fetchServiceByRecordId(mrId);

    return () => {
      resetStaffByRecord();
      resetServiceByRecord();
    };
  }, [opened, mrId]);

  const submitStaffRow = async (rowId: string) => {
    if (!mrId || !pid) {
      toast.error("Thiếu thông tin hồ sơ hoặc bệnh nhân.");
      return;
    }
    const current = staffState[rowId] ?? defaultLineState;
    const levelKey = current.level;
    if (!levelKey) {
      toast.error("Mức hài lòng không hợp lệ.");
      return;
    }

    const existedFbId = existingStaffFbId[rowId];

    try {
      setStaffState((prev) => ({
        ...prev,
        [rowId]: { ...(prev[rowId] ?? defaultLineState), sending: true },
      }));

      if (existedFbId) {
        await updateStaffFeedback(existedFbId, {
          doctorId: rowId,
          patientId: pid,
          medicalRecordId: mrId,
          satisfactionLevel: levelKey,
          comment: (current.comment ?? "").trim(),
        });
        toast.success("Cập nhật góp ý nhân viên thành công!");
      } else {
        if (!onSubmit) return;
        await onSubmit({
          doctorId: rowId,
          patientId: pid,
          medicalRecordId: mrId,
          satisfactionLevel: levelKey,
          comment: (current.comment ?? "").trim(),
        });
        toast.success("Gửi góp ý nhân viên thành công!");
      }

      await fetchStaffByRecordId(mrId);
      await loadStaffFeedbacks(rowId);
    } catch (e: any) {
      toast.error(
        e?.message ||
          (existedFbId ? "Cập nhật góp ý thất bại!" : "Gửi góp ý thất bại!")
      );
    } finally {
      setStaffState((prev) => ({
        ...prev,
        [rowId]: { ...(prev[rowId] ?? defaultLineState), sending: false },
      }));
    }
  };

  const submitServiceRow = async (rowId: string) => {
    if (!mrId || !pid) {
      toast.error("Thiếu thông tin hồ sơ hoặc bệnh nhân.");
      return;
    }
    const current = serviceState[rowId] ?? defaultLineState;
    const levelKey = current.level;
    if (!levelKey) {
      toast.error("Mức hài lòng không hợp lệ.");
      return;
    }

    const existedFbId = existingServiceFbId[rowId];

    try {
      setServiceState((prev) => ({
        ...prev,
        [rowId]: { ...(prev[rowId] ?? defaultLineState), sending: true },
      }));

      if (existedFbId) {
        await updateMedicalServiceFeedback(existedFbId, {
          medicalServiceId: rowId,
          patientId: pid,
          medicalRecordId: mrId,
          satisfactionLevel: levelKey,
          comment: (current.comment ?? "").trim(),
        });
        toast.success("Cập nhật góp ý dịch vụ thành công!");
      } else {
        if (!onSubmit) return;
        await onSubmit({
          medicalServiceId: rowId,
          patientId: pid,
          medicalRecordId: mrId,
          satisfactionLevel: levelKey,
          comment: (current.comment ?? "").trim(),
        });
        toast.success("Gửi góp ý cho dịch vụ thành công!");
      }

      await fetchServiceByRecordId(mrId);
      await loadServiceFeedbacks(rowId);
    } catch (e: any) {
      toast.error(
        e?.message ||
          (existedFbId ? "Cập nhật góp ý thất bại!" : "Gửi góp ý thất bại!")
      );
    } finally {
      setServiceState((prev) => ({
        ...prev,
        [rowId]: { ...(prev[rowId] ?? defaultLineState), sending: false },
      }));
    }
  };

  const toggleStaff = (id: string) =>
    setOpenStaff((p) => {
      const nextOpen = !p[id];
      if (nextOpen && !fetchedStaff[id]) loadStaffFeedbacks(id);
      return { ...p, [id]: nextOpen };
    });

  const toggleService = (id: string) =>
    setOpenService((p) => {
      const nextOpen = !p[id];
      if (nextOpen && !fetchedService[id]) loadServiceFeedbacks(id);
      return { ...p, [id]: nextOpen };
    });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="auto"
      styles={{ content: { height: "80vh", width: "90vw", maxWidth: 1200 } }}
      centered
      title={
        <div className="flex flex-col">
          <Text fw={600}>
            {titlePrefix}{" "}
            {record?.medicalRecordCode ? `# ${record.medicalRecordCode}` : ""}
          </Text>
          {record?.createdAt && dayjs(record.createdAt as any).isValid() && (
            <Text size="sm" c="dimmed">
              Ngày tạo:{" "}
              {dayjs(record.createdAt as any).format("DD/MM/YYYY HH:mm")}
            </Text>
          )}
        </div>
      }
    >
      <Stack gap="md">
        {/* Staff */}
        <Group justify="space-between" align="center" wrap="nowrap">
          <Badge variant="light">Góp ý theo nhân viên</Badge>
        </Group>

        <Paper withBorder p="sm" radius="md">
          {(loadingStaffs || loadingStaffByRecord) && <Loader size="sm" />}
          {(errorStaffs || errorStaffByRecord) && (
            <Alert color="red">
              {String(errorStaffs || errorStaffByRecord)}
            </Alert>
          )}
          {!loadingStaffs &&
            !loadingStaffByRecord &&
            !errorStaffs &&
            !errorStaffByRecord &&
            staffRows.length === 0 && (
              <Text c="dimmed" size="sm">
                Không có nhân viên liên quan.
              </Text>
            )}

          <Stack gap="xs">
            {staffRows.map((row, idx) => {
              const st: LineState = {
                ...defaultLineState,
                ...(staffState[row.staffId] ?? {}),
              };
              const open = !!openStaff[row.staffId];
              const existedFbId = existingStaffFbId[row.staffId];
              const isSending = !!st.sending || updatingStaffFb;
              const disabled = !mrId || !st.level || isSending;

              const list = staffFeedbackLists[row.staffId] || [];
              const listLoading =
                (!!loadingStaffFeedback[row.staffId] && open) ||
                (open && loadingStaffByRecord);

              return (
                <div key={row.staffId}>
                  <Group
                    gap="sm"
                    justify="space-between"
                    onClick={() => toggleStaff(row.staffId)}
                    style={{
                      cursor: "pointer",
                      padding: "8px 6px",
                      borderRadius: 8,
                      background: open
                        ? "var(--mantine-color-gray-0)"
                        : "transparent",
                    }}
                  >
                    <div style={{ minWidth: 220 }}>
                      <Text fw={500}>{row.name}</Text>
                      <Text size="xs" c="dimmed">
                        {[row.staffCode, row.role].filter(Boolean).join(" • ")}
                      </Text>
                    </div>
                    <Text size="xs" c="dimmed">
                      {open ? "Thu gọn" : "Mở"}
                    </Text>
                  </Group>

                  <Collapse in={open}>
                    <RatingRow
                      levelOptions={levelOptions}
                      state={st}
                      onChange={(patch) =>
                        setStaffState((prev) => ({
                          ...prev,
                          [row.staffId]: {
                            ...(prev[row.staffId] ?? defaultLineState),
                            ...patch,
                          },
                        }))
                      }
                      onSubmit={() => submitStaffRow(row.staffId)}
                      submitLabel={existedFbId ? "Cập nhật" : "Gửi"}
                      disabled={disabled}
                    />

                    <Divider my="sm" />
                    <HistoryList
                      loading={listLoading}
                      items={list}
                      onReload={() => {
                        if (mrId) fetchStaffByRecordId(mrId);
                      }}
                      getLevelLabel={(fb) =>
                        SatisfactionLevelMap[
                          (fb as any).satisfactionLevel as SatisfactionLevel
                        ] || ""
                      }
                      getComment={(fb) => (fb as any)?.comment}
                      getTimeText={(fb) => {
                        const d = dayjs((fb as any)?.createdAt);
                        return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "";
                      }}
                    />
                  </Collapse>

                  {idx < staffRows.length - 1 && <Divider my="sm" />}
                </div>
              );
            })}
          </Stack>
        </Paper>

        {/* Service */}
        <Group justify="space-between" align="center" wrap="nowrap">
          <Badge variant="light">Góp ý theo dịch vụ</Badge>
        </Group>

        <Paper withBorder p="sm" radius="md">
          {(loadingMedical || loadingServiceByRecord) && <Loader size="sm" />}
          {(errorMedical || errorServiceByRecord) && (
            <Alert color="red">
              {String(errorMedical || errorServiceByRecord)}
            </Alert>
          )}
          {!loadingMedical &&
            !loadingServiceByRecord &&
            !errorMedical &&
            !errorServiceByRecord &&
            serviceRows.length === 0 && (
              <Text c="dimmed" size="sm">
                Không có dịch vụ liên quan.
              </Text>
            )}

          <Stack gap="xs">
            {serviceRows.map((row, idx) => {
              const st: LineState = {
                ...defaultLineState,
                ...(serviceState[row.serviceId] ?? {}),
              };
              const open = !!openService[row.serviceId];
              const existedFbId = existingServiceFbId[row.serviceId];

              const list = serviceFeedbackLists[row.serviceId] || [];
              const listLoading =
                (!!loadingServiceFeedback[row.serviceId] && open) ||
                (open && loadingServiceByRecord);

              const isSending = !!st.sending || updatingServiceFb;
              const disabled = !mrId || !st.level || isSending;

              return (
                <div key={row.serviceId}>
                  <Group
                    gap="sm"
                    justify="space-between"
                    onClick={() => toggleService(row.serviceId)}
                    style={{
                      cursor: "pointer",
                      padding: "8px 6px",
                      borderRadius: 8,
                      background: open
                        ? "var(--mantine-color-gray-0)"
                        : "transparent",
                    }}
                  >
                    <div style={{ minWidth: 220 }}>
                      <Text fw={500}>{row.name}</Text>
                    </div>
                    <Text size="xs" c="dimmed">
                      {open ? "Thu gọn" : "Mở"}
                    </Text>
                  </Group>

                  <Collapse in={open}>
                    <RatingRow
                      levelOptions={levelOptions}
                      state={st}
                      onChange={(patch) =>
                        setServiceState((prev) => ({
                          ...prev,
                          [row.serviceId]: {
                            ...(prev[row.serviceId] ?? defaultLineState),
                            ...patch,
                          },
                        }))
                      }
                      onSubmit={() => submitServiceRow(row.serviceId)}
                      submitLabel={existedFbId ? "Cập nhật" : "Gửi"}
                      disabled={disabled}
                    />

                    <Divider my="sm" />
                    <HistoryList
                      loading={listLoading}
                      items={list}
                      onReload={() => {
                        if (mrId) fetchServiceByRecordId(mrId);
                      }}
                      getLevelLabel={(fb) =>
                        SatisfactionLevelMap[
                          (fb as any).satisfactionLevel as SatisfactionLevel
                        ] || ""
                      }
                      getComment={(fb) => (fb as any)?.comment}
                      getTimeText={(fb) => {
                        const d = dayjs((fb as any)?.createdAt);
                        return d.isValid() ? d.format("DD/MM/YYYY HH:mm") : "";
                      }}
                    />
                  </Collapse>

                  {idx < serviceRows.length - 1 && <Divider my="sm" />}
                </div>
              );
            })}
          </Stack>
        </Paper>

        <Group justify="end" mt="xs">
          <Button variant="default" onClick={onClose}>
            Đóng
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default FeedbackPatient;
