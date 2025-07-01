import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import MecicalService from "./pages/Admin/MedicalService/MedicalService";
import { ToastContainer } from "react-toastify";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { LandingPageAdminPage } from "./pages/LandingPageAdmin/LandingPageAdminPage";
import LandingPageUser from "./pages/LadingPageUser/LandingPageUser";
import RolePage from "./pages/Admin/Role/RolePage";
import PermissionPage from "./pages/Admin/Permission/PermissionPage";
import SignInClient from "./components/auth/SignInClient";
import StaffsPage from "./pages/Admin/StaffsService/StaffsPage";
import DepartmentPage from "./pages/Admin/DepartmentService/DepartmentPage";
import MedicalExaminationPage from "./pages/Admin/Examination Process/MedicalExaminationPage";
import RegisterMedicalExaminationPage from "./pages/Admin/RegisterMedicalExamination/RegisterMedicalExaminationPage";
import { PatientManagementPage } from "./pages/Admin/Patient-Management/PatientManagementPage";
import { MedicalRecordPage } from "./pages/Admin/Medical-Record/MedicalRecordPage";
const theme = createTheme({
  fontFamily: "Poppins, sans-serif",
});
export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/home" element={<LandingPageUser />} />
          <Route path="/" element={<LandingPageAdminPage />} />
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/admin/dashboard" element={<Home />} />
            <Route path="/admin/medical-service" element={<MecicalService />} />
            <Route path="/admin/role" element={<RolePage />} />
            <Route path="/admin/permission" element={<PermissionPage />} />
            <Route path="/admin/staffs" element={<StaffsPage />} />
            <Route path="/admin/departments" element={<DepartmentPage />} />
            <Route path="/admin/patients" element={<PatientManagementPage />} />
            <Route
              path="/admin/medical-records"
              element={<MedicalRecordPage />}
            />
            <Route
              path="/admin/register-medical-examination"
              element={<RegisterMedicalExaminationPage />}
            />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Examination Process  Page */}
            <Route
              path="/admin/medical-examination"
              element={<MedicalExaminationPage />}
            />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home/login" element={<SignInClient />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{
          marginTop: "70px",
        }}
      />
    </MantineProvider>
  );
}
