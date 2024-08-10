"use client";

import React, { useCallback } from "react";
import UploadFile from "@/components/UploadFile";
import { useFile } from "@/contexts/FileContext";

const Upload = () => {
  const { setFile } = useFile();

  const handleFileSelected = useCallback(
    (file: File | null) => {
      if (file) {
        setFile(file);
        window.location.href = "/chat";
      }
    },
    [setFile]
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-10">
      <p className="text-4xl font-semibold uppercase tracking-wide">
        Start chat by uploading pdf
      </p>
      <div className="w-[500px]">
        <UploadFile onFileSelected={handleFileSelected} initialFile={null} />
      </div>
    </div>
  );
};

export default Upload;
