import { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

export interface MonthlyTarget {
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
}

export interface WorkPerformance {
  staffId: string;
  staffName: string;
  staffCode: string;
  attendanceRate: number;
  leaveRate: number;
  totalShifts: number;
  attendedShifts: number;
  leaveShifts: number;
}

export interface PatientBirthday {
  fullName: string;
  patientCode: string;
  email: string;
  dob: string;
  phone: string;
}

export interface TopService {
  serviceName: string;
  serviceCode: string;
  usageCount: number;
  revenue: number;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  totalMedicalRecords: number;
  newPatientsThisMonth: number;

  monthlyTarget: MonthlyTarget;

  monthlyRevenueStats: {
    labels: string[];
    data: number[];
  };

  monthlyInvoiceStats: {
    labels: string[];
    data: number[];
  };

  workPerformance: WorkPerformance[];

  topServices: TopService[];

  birthdaysToday: PatientBirthday[];
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchDashboardStats = async () => {
    try {
      const res = await axiosInstance.get("/dashboards");
      setStats(res.data.result);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  return { stats, fetchDashboardStats };
}
