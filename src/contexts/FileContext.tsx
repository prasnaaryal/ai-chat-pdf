"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface FileContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);

  const setFileWithLog = (file: File | null) => {
    console.log("Setting file:", file);
    setFile(file);
  };

  return (
    <FileContext.Provider value={{ file, setFile: setFileWithLog }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};
