import { Button, Divider, Flex, Grid, ScrollArea, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import PatientPanel from "../../../components/patient/PatientPanel";
import useMedicalService from "../../../hooks/medical-service/useMedicalService";
//import useMedicalRecord from "../../../hooks/medicalRecord/useMedicalRecord";
import useQueuePatientService from "../../../hooks/queue-patients/useSearchQueuePatients";
import { QueuePatient } from "../../../types/Queue-patient/QueuePatient";
import ExaminationInfoForm from "../../../components/medical-examination/MedicalExaminationFormSection";
import VitalSignsForm from "../../../components/medical-examination/VitalSignsForm";
import DiagnosisForm from "../../../components/medical-examination/DiagnosisForm";
import ServiceTable from "../../../components/medical-examination/MedicalServiceTable";
import { IconDeviceFloppy } from "@tabler/icons-react";
import PatientInfoPanel from "../../../components/patient/PatientInfoPanel";
import useMyDepartment from "../../../hooks/department-service/useMyDepartment";
import { useUserInfo } from "../../../hooks/auth/useUserInfo";

const MedicalExaminationPage = () => {
  const { userInfo } = useUserInfo();
  const { department } = useMyDepartment();
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(
    null
  );

  const {
    patients,
    totalItems,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    loading,
    updateFilters,
  } = useQueuePatientService(
    department?.roomNumber ? { roomNumber: department.roomNumber } : {}
  );
  const form = useForm({
    initialValues: {
      appointmentDate: new Date(),
      doctor: "",
      department: "",
      symptoms: "",
      notes: "Không",
    },
  });

  const [activeTab, setActiveTab] = useState<"info" | "service">("info");
  interface ServiceRow {
    id: number;
    serviceId: string | null;
    quantity: number;
  }

  const [serviceRows, setServiceRows] = useState<ServiceRow[]>([
    { id: 1, serviceId: null, quantity: 1 },
  ]);

  const { medicalServices, fetchAllMedicalServicesNoPagination } =
    useMedicalService();
  const serviceOptions = medicalServices.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    fetchAllMedicalServicesNoPagination();
  }, []);

  // useEffect(() => {
  //   if (department?.roomNumber) {
  //     updateFilters({ roomNumber: department.roomNumber });
  //   }
  // }, [department]);

  const totalPages = Math.ceil(totalItems / pageSize);

  //const { submitExamination } = useMedicalRecord();

  return (
    <>
      {department && (
        <Text
          size="sm"
          fw={500}
          px="md"
          mb={0}
          c="red"
          style={{ borderRadius: 4 }}
        >
          {department.name} : Phòng {department.roomNumber} Chuyên khoa{" "}
          {department.specialization?.name ?? "Không có"}
        </Text>
      )}

      <Grid p="md" gutter="md" align="stretch">
        <Grid.Col span={{ base: 12, md: 5 }} style={{ height: "100%" }}>
          <PatientPanel
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
            patients={patients}
            totalElements={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            setPageSize={setPageSize}
            setCurrentPage={setCurrentPage}
            department={department}
            updateFilters={updateFilters}
          />
        </Grid.Col>

        {/* Cột phải - Form khám bệnh */}
        <Grid.Col span={{ base: 12, md: 7 }}>
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
              //onClick={handleEndExamination}
              //disabled={!selectedPatient}
            >
              Kết thúc khám
            </Button>
          </Flex>

          <PatientInfoPanel patient={selectedPatient} />

          <form>
            {activeTab === "info" && (
              <>
                <Divider
                  my="sm"
                  label="Thông tin khám bệnh"
                  labelPosition="left"
                />
                <ExaminationInfoForm
                  form={form}
                  doctorName={userInfo?.username ?? "Không rõ"}
                  doctorId={userInfo?.userId ?? ""}
                  departmentName={department?.name ?? "Không rõ"}
                  departmentId={department?.id ?? ""}
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

            {activeTab === "service" && (
              <>
                <Divider my="sm" label="Kê dịch vụ" labelPosition="left" />
                <Flex justify="space-between" align="center" mt="sm" mb="sm">
                  <Text fw={600}>Danh sách dịch vụ</Text>
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

            <Flex mt="md" gap="sm">
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
              >
                Lưu
              </Button>
            </Flex>
          </form>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default MedicalExaminationPage;
