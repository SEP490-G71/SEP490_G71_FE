import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { Role } from "../../types/Admin/Role/RolePage";
import { toast } from "react-toastify";

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
      console.error("Failed to fetch roles:", error);
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
      console.error("Failed to fetch role by id:", error);
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
      console.error("Failed to delete role by id:", error);
      toast.error("Failed to delete role");
    }
  };

  return {
    roles,
    setRoles,
    totalItems,
    loading,
    setLoading,
    fetchAllRoles,
    fetchRoleById,
    handleDeleteRoleById,
  };
};

export default useRoleService;
