import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../services/token.service";

const RequireAuth = () => {
  const accessToken = getAccessToken();

  return !accessToken ? <Navigate to="/signin" replace={true} /> : <Outlet />;
};

export default RequireAuth;
