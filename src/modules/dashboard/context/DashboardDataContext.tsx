"use client";

import { createContext, useContext } from "react";
import { useDashboardData } from "@/modules/dashboard/hooks/useDashboardData";

type DashboardDataContextValue = ReturnType<typeof useDashboardData>;

const DashboardDataContext = createContext<DashboardDataContextValue | null>(
  null
);

export function DashboardDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useDashboardData();
  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardContext must be used within DashboardDataProvider");
  }
  return context;
}
