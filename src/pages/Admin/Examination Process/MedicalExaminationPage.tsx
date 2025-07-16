import {
  Button,
  Divider,
  Flex,
  Grid,
  Paper,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import PatientPanel from "../../../components/patient/PatientPanel";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import { usePatientStore } from "../../../components/stores/patientStore";
import useDepartmentService from "../../../hooks/department-service/useDepartmentService";
import useDepartmentStaffs from "../../../hooks/department-Staffs/useDepartmentStaffs";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
import { toast } from "react-toastify";
import ExaminationInfoForm from "../../../components/medical-examination/MedicalExaminationFormSection";
import VitalSignsForm from "../../../components/medical-examination/VitalSignsForm";
import DiagnosisForm from "../../../components/medical-examination/DiagnosisForm";
import ServiceTable from "../../../components/medical-examination/MedicalServiceTable";
import { usePatientManagement } from "../../../hooks/Patient-Management/usePatientManagement";
import useMedicalRecord from "../../../hooks/medicalRecord/useMedicalRecord";
import { Patient as PatientPanelType } from "../../../types/Patient/Patient";
const MedicalExaminationPage = () => {
  const { selectedPatient, setSelectedPatient } = usePatientStore();
  const { patients: patientList, fetchAllPatients } = usePatientManagement();

  useEffect(() => {
    fetchAllPatients(0, 100);
  }, []);

  const form = useForm({
    initialValues: {
      appointmentDate: new Date(),
      doctor: "",
      department: "",
      symptoms: "",
      notes: "Không",
    },
  });

  interface ServiceRow {
    id: number;
    serviceId: string | null;
    quantity: number;
  }
  const [activeTab, setActiveTab] = useState<"info" | "service">("info");

  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([
    { id: 1, serviceId: null, quantity: 1 },
  ]);

  const { medicalServices, fetchAllMedicalServices } = useMedicalService();
  const serviceOptions = medicalServices.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    fetchAllMedicalServices(0, 100);
  }, []);

  const {
    departments,
    fetchAllDepartments,
    loading: departmentLoading,
  } = useDepartmentService();

  useEffect(() => {
    fetchAllDepartments();
  }, []);

  const selectedDepartmentId = form.values.department;
  const { data: departmentStaffs = [], loading: staffLoading } =
    useDepartmentStaffs(selectedDepartmentId);

  const doctorOptions = departmentStaffs
    .filter((s) => s.position === "DOCTOR")
    .map((staff) => ({ value: staff.staffId, label: staff.staffName }));

  const departmentOptions = departments.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const handleEndExamination = () => {
    if (selectedPatient) {
      setSelectedPatient(null);
      toast.success("Đã kết thúc khám bệnh cho bệnh nhân.");
    }
  };

  const { submitExamination, loading } = useMedicalRecord();

  const handleSave = async () => {
    if (!selectedPatient || !form.values.doctor) {
      toast.error("Thiếu thông tin bệnh nhân hoặc bác sĩ");
      return;
    }

    await submitExamination({
      patientId: selectedPatient.id,
      staffId: form.values.doctor,
      diagnosisText: form.values.symptoms,
      services: serviceRows,
    });
  };
  const normalizedPatientList: PatientPanelType[] = patientList.map((p) => ({
    ...p,
    patientCode: p.patientCode ?? "",
    middleName: p.middleName ?? "", // ép undefined thành ""
  }));

  return (
    <Grid p="md" gutter="md" align="start">
      <PatientPanel
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
        patientList={normalizedPatientList}
        setPatientList={() => {}}
      />

      <Grid.Col span={{ base: 12, md: 8 }}>
        {/* ===== Nút chuyển tab và kết thúc khám ===== */}
        <Flex justify="space-between" align="center" mb="sm">
          <Flex gap="xs">
            <Button
              size="sm"
              variant={activeTab === "info" ? "filled" : "outline"}
              onClick={() => setActiveTab("info")}
            >
              Thông tin khám
            </Button>
            <Button
              size="sm"
              variant={activeTab === "service" ? "filled" : "outline"}
              onClick={() => setActiveTab("service")}
            >
              Kê dịch vụ
            </Button>
          </Flex>

          <Button
            variant="light"
            color="red"
            size="sm"
            onClick={handleEndExamination}
            disabled={!selectedPatient}
          >
            Kết thúc khám
          </Button>
        </Flex>

        <Paper p="md">
          {/* ===== Thông tin bệnh nhân ===== */}
          <PatientInfoPanel patient={selectedPatient} />

          <form
            onSubmit={(e) => {
              e.preventDefault(); //  Chặn reload trang
              handleSave(); // Gọi logic lưu
            }}
          >
            {/* === Tab 1: Thông tin khám === */}
            {activeTab === "info" && (
              <>
                <Divider
                  my="sm"
                  label="Thông tin khám bệnh"
                  labelPosition="left"
                />
                <ExaminationInfoForm
                  form={form}
                  doctorOptions={doctorOptions}
                  departmentOptions={departmentOptions}
                  staffLoading={staffLoading}
                  departmentLoading={departmentLoading}
                />

                <VitalSignsForm />

                <DiagnosisForm
                  values={{
                    symptoms: form.values.symptoms,
                    notes: form.values.notes,
                  }}
                  onChange={(field, value) => form.setFieldValue(field, value)}
                />
              </>
            )}

            {/* === Tab 2: Kê dịch vụ === */}
            {activeTab === "service" && (
              <>
                <Divider my="sm" label="Kê dịch vụ" labelPosition="left" />

                <Flex justify="space-between" align="center" mt="sm" mb="sm">
                  <Text fw={600}>Danh sách dịch vụ</Text>
                  <Flex gap="xs">
                    <Button
                      color="blue"
                      size="xs"
                      leftSection="💾"
                      onClick={handleSave}
                      loading={loading}
                    >
                      Lưu
                    </Button>
                  </Flex>
                </Flex>

                <ScrollArea offsetScrollbars scrollbarSize={8}>
                  <ServiceTable
                    serviceRows={serviceRows}
                    setServiceRows={setServiceRows}
                    medicalServices={medicalServices}
                    serviceOptions={serviceOptions}
                    editable={true}
                    showDepartment={true}
                  />
                </ScrollArea>
              </>
            )}

            {/* ==== Nút lưu dùng chung ==== */}
            <Flex mt="md" gap="sm">
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                loading={loading}
              >
                Lưu
              </Button>
            </Flex>
          </form>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default MedicalExaminationPage;
