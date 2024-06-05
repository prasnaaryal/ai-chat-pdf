"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineFilePdf } from "react-icons/ai";

const UploadFile: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
    accept: {
      "application/pdf": [],
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="flex items-center justify-center h-48 w-full bg-white rounded-lg cursor-pointer"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : file ? (
          <div className="flex flex-col items-center gap-3">
            <div>
              {file.type.startsWith("image/") ? (
                <div className="flex items-center w-32 h-24 justify-center rounded-md">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="flex items-center w-32 h-24 justify-center rounded-md border-2 border-primary border-dashed">
                  <AiOutlineFilePdf className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
            <p className="flex flex-col text-sm text-black items-center gap-2">
              {file.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center w-32 h-24 justify-center rounded-md border-2 border-primary border-dashed">
              <IoCloudUploadOutline className="w-10 h-10 text-primary" />
            </div>
            <p className="flex flex-col text-sm text-black items-center gap-2">
              Upload image or pdf file
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
