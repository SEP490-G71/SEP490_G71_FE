import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Role } from "../../types/Admin/Role/RolePage";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../components/utils/getErrorMessage";

const useRoleService = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAllRoles = async (
    page: number = 0,
    size: number = 5,
    sortBy: string = "name",
    sortDir: "asc" | "desc" = "asc",
    filters?: {
      name?: string;
    }
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/roles", {
        params: {
          page,
          size,
          sort: `${sortBy},${sortDir}`,
          name: filters?.name,
        },
      });

      console.log("Fetched roles:", res.data.result);
      setRoles(res.data.result.content);
      setTotalItems(res.data.result.totalElements);
    } catch (error) {
      console.error("Lỗi fetch roles:", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách vai trò"));
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesExceptPatient = async (
    page: number = 0,
    size: number = 100
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/roles", {
        params: {
          page,
          size,
        },
      });

      const allRoles: Role[] = res.data.result.content;
      const filtered = allRoles.filter((role) => role.name !== "PATIENT");

      setRoles(filtered);
      setTotalItems(filtered.length);
    } catch (error) {
      console.error("Lỗi fetch roles except PATIENT:", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách vai trò"));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleById = async (id: string) => {
    try {
      console.log(`Fetching role by id: ${id}`);

      const res = await axiosInstance.get(`/roles/${id}`);
      return res.data.result as Role;
    } catch (error) {
      console.error("Lỗi fetch role by id:", error);
      toast.error(getErrorMessage(error, "Không thể tải thông tin vai trò"));
      return null;
    }
  };

  const handleDeleteRoleById = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/roles/${id}`);
      if (res.status === 200) {
        toast.success("Deleted successfully");
        fetchAllRoles();
      }
    } catch (error) {
      console.error("Lỗi delete role by id:", error);
      toast.error(getErrorMessage(error, "Xoá vai trò thất bại"));
    }
  };

  return {
    roles,
    setRoles,
    totalItems,
    loading,
    setLoading,
    fetchAllRoles,
    fetchRolesExceptPatient,
    fetchRoleById,
    handleDeleteRoleById,
  };
};

export default useRoleService;
