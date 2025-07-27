import { Title, Text } from "@mantine/core";
import ServiceTableSection from "../common/ServiceTableSection";
import { MedicalRecordOrder } from "../../types/MedicalRecord/MedicalRecordDetail";
import { MedicalRecordStatus } from "../../enums/MedicalRecord/MedicalRecordStatus";

interface Props {
  pendingServices: MedicalRecordOrder[];
  doneServices?: MedicalRecordOrder[];
  onAction?: (item: MedicalRecordOrder) => void;
  recordStatus?: MedicalRecordStatus;
}

const ServiceExecutionPanel = ({
  pendingServices,
  doneServices = [],
  onAction,
  recordStatus,
}: Props) => {
  const mappedDoneServices = doneServices.map((order) => ({
    ...order,
    completedBy: order.results?.[0]?.completedBy ?? order.createdBy,
  }));

  const isUnpaid = recordStatus === MedicalRecordStatus.WAITING_FOR_PAYMENT;

  return (
    <>
      <div className="mb-6 mt-4">
        <Title order={5} mb="xs" c="orange">
          DỊCH VỤ CHỜ LÀM
        </Title>

        {isUnpaid && (
          <Text c="red" fw={700} size="lg" mb="sm">
            Hồ sơ chưa được thanh toán
          </Text>
        )}

        <ServiceTableSection
          type="pending"
          headers={["#", "Tên dịch vụ", "Người tạo", "Thao tác"]}
          data={pendingServices}
          onAction={onAction}
          centeredColumns={[0, 3]}
        />
      </div>

      <div>
        <Title order={5} mb="xs" c="blue">
          DỊCH VỤ ĐÃ LÀM
        </Title>
        <ServiceTableSection
          type="done"
          headers={["#", "Tên dịch vụ", "Người khám", "Thao tác"]}
          data={mappedDoneServices}
          onAction={onAction}
          centeredColumns={[0, 3]}
        />
      </div>
    </>
  );
};

export default ServiceExecutionPanel;
