import { Text } from "@mantine/core";

interface StatusCellProps {
  status: string;
}

const StatusCell = ({ status }: StatusCellProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "chờ khám":
        return "orange";
      case "đang khám":
        return "green";
      case "tạm dừng":
      case "tạm dừng khám":
        return "red";
      case "hoàn thành":
      case "đã khám":
        return "blue";
      case "bỏ khám":
        return "gray";
      default:
        return "gray";
    }
  };

  return (
    <Text
      size="sm"
      fw={500}
      c={getStatusColor(status)}
      style={{ textAlign: "center" }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Text>
  );
};

export default StatusCell;
