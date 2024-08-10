"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AiOutlineSend, AiOutlineFilePdf } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import openAIImage from "../../../../public/assets/images/openAI.png";
import TypingSVG from "../../../../public/assets/images/typing.svg";
import { useFile } from "@/contexts/FileContext";
import axiosConfig from "@/config/axios";

type ChatInterfaceProps = {
  params: {
    slug: string; // Adjust according to your dynamic route
  };
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ params }) => {
  const { user } = useUser();
  const { file } = useFile();
  const chatId = params.slug; // Use the slug from params directly

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

      try {
        // Make the API call to /conversation/ with chat_id and question
        const response = await axiosConfig.post("/conversation/", {
          chat_id: Number(chatId),
          question: input,
        });

        // Simulate typewriter effect
        const aiResponse = response.data.answer || "No response received.";
        typeWriterEffect(aiResponse);
      } catch (error) {
        console.error("Error during conversation:", error);
        // Handle the error as needed (e.g., show an error message)
      }

      setLoading(false);
    }
  };

  const typeWriterEffect = (text: string) => {
    let index = 0;
    const interval = 50; // Adjust the speed of the typewriter effect
    const typingMessage = {
      id: messages.length + 2,
      text: "",
      sender: "ai",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages.pop(); // Remove the typing message
      updatedMessages.push(typingMessage); // Add the typing effect message
      return updatedMessages;
    });

    const type = () => {
      if (index < text.length) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const currentMessage = updatedMessages[updatedMessages.length - 1];
          currentMessage.text = (
            <span>
              {text.slice(0, index + 1)}
              <span className="blinking-cursor">|</span>
            </span>
          );
          return updatedMessages;
        });
        index++;
        setTimeout(type, interval);
      } else {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const currentMessage = updatedMessages[updatedMessages.length - 1];
          currentMessage.text = text; // Finalize the message
          return updatedMessages;
        });
      }
    };

    type();
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
          <div className="relative flex w-full">
            <textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg resize-none overflow-hidden"
              placeholder="Send a message"
              rows={1}
              style={{ minHeight: "38px" }}
            />
            <Button type="submit" disabled={loading}>
              <AiOutlineSend />
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
