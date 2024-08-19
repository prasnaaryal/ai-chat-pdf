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
        console.log("File selected:", file); // Debugging log
        setFile(file);

        try {
          // Prepare the data for presigned URL generation
          const payload = {
            filename: file.name,
            content_type: file.type,
          };

          console.log("Payload for presigned URL:", payload); // Debugging log

          // Call the API to generate the presigned URL
          const presignedResponse = await axiosConfig.post(
            "/generate-presigned-url/",
            payload
          );

          console.log("Presigned URL response:", presignedResponse.data); // Debugging log

          // Extract URL and key from the response
          let { url, key } = presignedResponse.data;

          if (url) {
            // Upload the file to S3 using the presigned URL
            const uploadResponse = await axiosConfig.put(url, file, {
              headers: {
                "Content-Type": file.type,
              },
            });

            console.log("File uploaded successfully:", uploadResponse.status); // Debugging log

            if (uploadResponse.status === 200) {
              // Remove the 'upload/' prefix from the key
              const cleanedKey = key.replace(/^uploads\//, "");

              console.log("Cleaned Key:", cleanedKey); // Debugging log

              // Construct the request URL for the chat creation
              const requestUrl = `/chat/?file_key=${key}`;

              console.log("Request URL:", requestUrl); // Debugging log

              // Send the file_key as a query parameter in the /chat POST request
              const chatResponse = await axiosConfig.post(requestUrl, null, {
                maxRedirects: 0, // Disable automatic redirects
              });

              if (chatResponse.status === 307) {
                console.log("307 Temporary Redirect:", chatResponse.data);
                // Handle the redirect response, or use the data as needed
              } else {
                console.log("Chat created:", chatResponse.data); // Debugging log

                // Redirect to the chat page using the id and cleaned key from the response
                const chatId = chatResponse.data.id;
                window.location.href = `/chat/${chatId}?name=${cleanedKey}`;
              }
            } else {
              console.error("File upload failed");
            }
          } else {
            console.error("Invalid presigned URL response");
          }
        } catch (error) {
          console.error("Error during the file upload process:", error);
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
        Start chat by uploading PDF
      </p>
      <div className="w-[500px]">
        <UploadFile onFileSelected={handleFileSelected} />
      </div>
    </div>
  );
};

export default Upload;
