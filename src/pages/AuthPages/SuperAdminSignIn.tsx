import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SuperAdminSignInForm from "../../components/auth/SuperAdminSignInForm";

export default function SuperAdminSignIn() {
  return (
    <>
      <PageMeta
        title="Super Admin Sign In | MedSoft"
        description="Trang đăng nhập dành cho Super Admin"
      />
      <AuthLayout>
        <SuperAdminSignInForm />
      </AuthLayout>
    </>
  );
}
