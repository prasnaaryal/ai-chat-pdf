// src/app/chat/page.tsx

// Ensure to use "use client" to render this component on the client side
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AiOutlineSend, AiOutlineFilePdf } from "react-icons/ai";
import { GoPaperclip } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import openAIImage from "../../../public/assets/images/openAI.png";
import TypingSVG from "../../../public/assets/images/typing.svg";
import { useFile } from "@/contexts/FileContext";

const ChatInterface = () => {
  const { user } = useUser();
  const { file } = useFile();
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string | JSX.Element; sender: string }>
  >(
    file
      ? [
          {
            id: 1,
            text: (
              <div className="flex items-center justify-center space-x-3 p-4 bg-white shadow-md rounded-lg">
                <AiOutlineFilePdf className="w-8 h-8 text-primary" />
                <p>{file.name}</p>
              </div>
            ),
            sender: "user",
          },
        ]
      : []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(file !== null);

  useEffect(() => {
    setIsFileUploaded(file !== null);
  }, [file]);

  useEffect(() => {
    console.log("File in ChatInterface:", file);
  }, [file]);

  const TypeLoader: React.FC = () => {
    return <Image src={TypingSVG} className="w-6 h-6" alt="Typing..." />;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (input.trim()) {
      setLoading(true);

      const userMessage = {
        id: messages.length + 1,
        text: input.replace(/(?:\r\n|\r|\n)/g, "<br>"),
        sender: "user",
      };

      const aiTypingMessage = {
        id: messages.length + 2,
        text: <TypeLoader />,
        sender: "ai",
      };

      setMessages([...messages, userMessage, aiTypingMessage]);
      setInput("");

      if (textAreaRef.current) {
        textAreaRef.current.style.height = "38px";
      }

      // Simulate an asynchronous action (e.g., API call) with a delay of 2500ms
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Replace the typing message with the actual AI response
      const aiResponse = {
        id: messages.length + 2,
        text: "Hello! How can I assist you today?", // Replace this with the actual AI response
        sender: "ai",
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop(); // Remove the typing message
        updatedMessages.push(aiResponse); // Add the AI response
        return updatedMessages;
      });

      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "inherit";
    e.currentTarget.style.height = `${Math.min(
      e.currentTarget.scrollHeight,
      94
    )}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessageText = (text: string | JSX.Element) => {
    if (typeof text === "string") {
      return text.split("<br>").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index !== text.split("<br>").length - 1 && <br />}
        </React.Fragment>
      ));
    } else {
      return text; // Return JSX element as is
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          text: (
            <div className="flex items-center justify-center space-x-3 p-4 bg-white shadow-md rounded-lg">
              <AiOutlineFilePdf className="w-8 h-8 text-primary" />
              <p>{uploadedFile.name}</p>
            </div>
          ),
          sender: "user",
        },
      ]);
      setIsFileUploaded(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-auto flex flex-col-reverse"
      >
        {[...messages].reverse().map((message) => (
          <div key={message.id}>
            <div
              className={`flex items-end space-x-2 py-4 px-40 ${
                message.sender === "ai" ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <Image
                src={
                  message.sender === "ai"
                    ? openAIImage
                    : user?.profileImageUrl || "https://github.com/shadcn.png"
                }
                alt={`${message.sender} Avatar`}
                className="w-10 h-10 object-cover rounded-full"
                width={40}
                height={40}
              />
              <div className="flex flex-col flex-1">
                <div className="p-2 rounded text-black whitespace-pre-wrap">
                  {formatMessageText(message.text)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="py-4 px-40 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              className="w-full h-10 py-4 pl-12 pr-12 border border-gray-300 rounded-full resize-none overflow-hidden bg-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none"
              placeholder="Message ChatPDF"
              rows={1}
              style={{ minHeight: "38px" }}
            />
            { !isFileUploaded && (
              <label
                htmlFor="file-upload"
                className="absolute inset-y-0 left-0 flex items-center pl-4 cursor-pointer"
              >
                <GoPaperclip className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            )}
            <Button
              type="submit"
              className="absolute inset-y-0 right-0 mt-1 mr-2 bg-gray-700 hover:bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center"
              disabled={loading}
            >
              <AiOutlineSend className="w-5 h-5" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-center text-slate-500 mt-4">
          ChatPDF can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
