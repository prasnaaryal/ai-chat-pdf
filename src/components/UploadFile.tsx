'use client';

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IoCloudUploadOutline } from "react-icons/io5";
import { AiOutlineFilePdf } from "react-icons/ai";

interface DropzoneProps {
  onFileSelected: (file: File | null) => void;
  initialFile?: File | null;
}

const UploadFile: React.FC<DropzoneProps> = ({
  onFileSelected,
  initialFile,
}) => {
  const [file, setFile] = useState<File | null>(initialFile || null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      onFileSelected(acceptedFiles[0]);
    },
    onFileDialogCancel: () => onFileSelected(null),
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      onFileSelected(initialFile);
    }
  }, [initialFile, onFileSelected]);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="flex items-center justify-center h-48 w-full bg-silver cursor-pointer"
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
