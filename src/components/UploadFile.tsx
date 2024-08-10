"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";

interface DropzoneProps {
  onFileSelected: (file: File | null) => void;
}

const UploadFile: React.FC<DropzoneProps> = ({ onFileSelected }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      console.log("File uploaded:", uploadedFile);
      onFileSelected(uploadedFile); // Pass the file to the parent component's handler
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
