// PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import PermissionDeniedPage from "../pages/PermissionDeniedPage/PermissionDeniedPage";
import { useSelector } from "react-redux";
import { getUserLoginSelector } from "../redux/selectors";

export const PrivateRoute = ({ children, roles }) => {
  const userSelector = useSelector(getUserLoginSelector);
  const userLocal =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));

  const userRef = userLocal || userSelector;
  console.log(userRef.role);
  // Kiểm tra xem người dùng có vai trò phù hợp không
  // console.log(roles.includes(userSelector.role));
  console.log(roles.includes(userRef.role));

  if (!userRef || userRef.role === "") {
    console.log("chưa login");
    toastr.error("PLease login!");
    return <Navigate to="/course" />;
  }

  if (roles.includes(userRef.role)) {
    console.log("Private route redirect");
    return <Navigate to="/permission-denied" />;
  }

  return <>{children}</>;
};
