import { Outlet } from "react-router";
import { PatientPortalHeader } from "./Header/PatientPortalHeader";
import { useUserInfo } from "../../hooks/auth/useUserInfo";
import { useEffect } from "react";
import usePatientDetail from "../../hooks/Patient-Management/usePatientGetOne";

const PatientPortalPage = () => {
  const { userInfo, loading: loadingUser } = useUserInfo();
  const {
    patient,
    loading: loadingPatient,
    fetchPatientDetail,
  } = usePatientDetail();

  useEffect(() => {
    if (userInfo?.userId) {
      fetchPatientDetail(userInfo.userId);
    }
  }, [userInfo?.userId]);

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <PatientPortalHeader
        username={userInfo?.username ?? ""}
        loadingUser={loadingUser}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet
            context={{
              patient,
              patientId: patient?.id ?? null,
              loadingPatient,
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default PatientPortalPage;
