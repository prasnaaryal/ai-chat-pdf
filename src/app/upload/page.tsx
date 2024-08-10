"use client";

import React, { useCallback } from "react";
import UploadFile from "@/components/UploadFile";
import { useFile } from "@/contexts/FileContext";
import axiosConfig from "@/config/axios"; // Import your axios configuration

const Upload = () => {
  const { setFile } = useFile();

  const handleFileSelected = useCallback(
    async (file: File | null) => {
      if (file) {
        console.log("File selected:", file); // Debugging log
        setFile(file);

        try {
          const formData = new FormData();
          formData.append("files", file, "application/pdf"); // Append the file with the correct content type

          console.log("FormData prepared:", formData); // Debugging log

          // Make the POST request to upload the file
          const response = await axiosConfig.post("/chat", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("API response:", response.data); // Debugging log

          // Assuming the response contains an `id` to navigate to the chat page
          const { id } = response.data;

          // Redirect to the specific chat page
          if (id) {
            window.location.href = `/chat/${id}`;
          } else {
            console.error("No ID returned in the response");
          }
        } catch (error) {
          console.error("Error uploading and processing the file:", error);
          // Handle error (e.g., show a notification to the user)
        }
      } else {
        console.warn("No file selected"); // Debugging log
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
        <UploadFile onFileSelected={handleFileSelected} />
      </div>
    </div>
  );
};

export default Upload;
