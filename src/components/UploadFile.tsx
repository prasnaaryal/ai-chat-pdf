"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineFilePdf } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useFile } from "@/contexts/FileContext";

interface DropzoneProps {
  onFileSelected: (file: File | null) => void;
  initialFile?: File | null;
}

const UploadFile: React.FC<DropzoneProps> = ({
  onFileSelected,
  initialFile,
}) => {
  const { setFile } = useFile();
  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      console.log("File uploaded:", uploadedFile);
      setFile(uploadedFile);
      router.push("/chat");
    },
    accept: {
      "application/pdf": [],
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="flex items-center justify-center h-48 w-full bg-white shadow-md rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center w-32 h-24 justify-center rounded-md border-2 border-primary border-dashed">
              <IoCloudUploadOutline className="w-10 h-10 text-primary" />
            </div>
            <p className="flex flex-col text-sm text-black items-center gap-2">
              Upload PDF file
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
