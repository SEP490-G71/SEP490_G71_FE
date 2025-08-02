import { Button, Flex, Modal, Title } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { toast } from "react-toastify";
import ExaminationSectionForm from "./ExaminationSectionForm";
import useUpdateMedicalRecord from "../../hooks/medicalRecord/useUpdateMedicalRecord";
import updatePatientStatus from "../../hooks/queue-patients/updatePatientStatus";

interface Props {
  opened: boolean;
  onClose: () => void;
  form: UseFormReturnType<any>;
  medicalRecordId: string;
  patientId: string;
  onDone: () => void;
  doctorName: string;
  doctorId: string;
  roomNumber: string;
  departmentName: string;
  departmentId: string;
}

const EndExaminationModal = ({
  opened,
  onClose,
  form,
  medicalRecordId,
  patientId,
  onDone,
  doctorName,
  doctorId,
  roomNumber,
  departmentName,
  departmentId,
}: Props) => {
  const { updateMedicalRecord } = useUpdateMedicalRecord();

  const handleConfirmEnd = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      toast.error("❌ Vui lòng kiểm tra lại thông tin trước khi kết thúc.");
      return;
    }

    try {
      await updateMedicalRecord({
        medicalRecordId,
        diagnosisText: form.values.symptoms,
        summary: form.values.notes,
        temperature: form.values.temperature,
        respiratoryRate: form.values.respiratoryRate,
        bloodPressure: form.values.bloodPressure,
        heartRate: form.values.heartRate,
        heightCm: form.values.heightCm,
        weightKg: form.values.weightKg,
        bmi: form.values.bmi,
        spo2: form.values.spo2,
        notes: form.values.notes,
      });

      await updatePatientStatus(patientId, "DONE");

      toast.success("✅ Đã kết thúc khám");
      onClose();
      onDone();
    } catch (err) {
      toast.error("❌ Lỗi khi kết thúc khám");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Xác nhận kết thúc khám bệnh"
      size="lg"
      centered
    >
      <Title order={5} mb="xs">
        Chỉnh sửa thông tin trước khi kết thúc
      </Title>

      <ExaminationSectionForm
        form={form}
        doctorName={doctorName}
        doctorId={doctorId}
        roomNumber={roomNumber}
        departmentName={departmentName}
        departmentId={departmentId}
      />

      <Flex mt="md" justify="flex-end" gap="sm">
        <Button variant="default" onClick={onClose}>
          Huỷ
        </Button>
        <Button color="red" onClick={handleConfirmEnd}>
          Kết thúc khám
        </Button>
      </Flex>
    </Modal>
  );
};

export default EndExaminationModal;
