"use client";

import React, { useCallback } from "react";
import UploadFile from "@/components/UploadFile";
import { useFile } from "@/contexts/FileContext";
import axiosConfig from "@/config/axios";

const Upload = () => {
  const { setFile } = useFile();

  const handleFileSelected = useCallback(
    async (file: File | null) => {
      if (file) {
        console.log("File selected:", file);
        setFile(file);

        try {
          const formData = new FormData();
          formData.append("file", file);

          console.log("Uploading file to backend");

          const uploadResponse = await axiosConfig.post(
            "generate-presigned-url/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.status === 200) {
            const { id, file_name } = uploadResponse.data;
            console.log("File uploaded successfully:", uploadResponse.data);

            const chatPayload = {
              id: id,
            };

            const chatResponse = await axiosConfig.post("/chat/", chatPayload, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (chatResponse.status === 200) {
              console.log("Chat created:", chatResponse.data);

              const chatId = chatResponse.data.id;
              window.location.href = `/chat/${chatId}?name=${file_name}`;
            } else {
              console.error("Failed to create chat");
            }
          } else {
            console.error("File upload failed");
          }
        } catch (error) {
          console.error("Error during the file upload process:", error);
        }
      } else {
        console.warn("No file selected");
      }
    },
    [setFile]
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 space-y-10">
      <p className="text-4xl font-semibold uppercase tracking-wide">
        Start chat by uploading PDF
      </p>
      <div className="w-[500px]">
        <UploadFile onFileSelected={handleFileSelected} />
      </div>
    </div>
  );
};

export default Upload;
