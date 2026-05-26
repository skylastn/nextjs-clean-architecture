"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthService } from "../dependency_injection/global_container";

interface GlobalContextProps {
  changeDarkMode: () => void;
  isDarkMode: boolean;
  fontColor: string;
  bgColor: string;
}

const GlobalLogic = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const service = useAuthService();
  const [isDarkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const value = service.isDarkMode;
    if (value == isDarkMode) return;
    setDarkMode(value);
  }, [service, isDarkMode]);

  const changeDarkMode = () => {
    const value = !isDarkMode;
    service.saveIsDarkMode(value);
    setDarkMode(value);
  };

  const fontColor = isDarkMode ? "text-white" : "text-black";
  const bgColor = isDarkMode ? "bg-[#171c28]" : "bg-gray-400";

  return (
    <GlobalLogic.Provider
      value={{ changeDarkMode, isDarkMode, fontColor, bgColor }}
    >
      {children}
    </GlobalLogic.Provider>
  );
};

export const useGlobalLogic = () => {
  const context = useContext(GlobalLogic);
  if (!context) {
    throw new Error("useGlobalLogic must be used within GlobalProvider");
  }
  return context;
};
