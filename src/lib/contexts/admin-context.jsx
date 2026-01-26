"use client";
import React, { createContext, useState } from "react";

export const AdminContext = createContext();
export const AdminProvider = ({ children }) => {
    const[ isAdmin,setAdmin] =useState(true); // Set this based on your authentication logic
  const [refreshData, setRefreshData] = useState();
  const [tournaments, setTournaments] = useState();
  const [participants, setParticipants] = useState();

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setAdmin,
        refreshData,
        setRefreshData,
        tournaments,
        setTournaments,
        participants,
        setParticipants,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};



