import React from "react";
import ResultTableSuivi from "./ResultTableSuivi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../reducers/auth.reducer";
import { Navigate } from "react-router-dom";

export const Home = () => {
  const currentUser = useSelector(selectCurrentUser);
  if (currentUser && currentUser.role === "booker ext") {
    return <Navigate to="/mes_bookings" />;
  }
  return (
    <>
      <ResultTableSuivi />
    </>
  );
};
