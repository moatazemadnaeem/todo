import { useAuth } from "../hooks/userAuth";
import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
function ProtectRoute() {
  const { user, loading, error } = useAuth();
  if (loading) {
    return (
      <div className="glob-spin">
        <Spin size="large" />
      </div>
    );
  }
  if (!user && error) {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
}

export default ProtectRoute;
