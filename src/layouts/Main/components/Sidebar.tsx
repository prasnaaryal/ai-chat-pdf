"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LuLogOut } from "react-icons/lu";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { IoAdd } from "react-icons/io5";

import axiosConfig from "@/config/axios";

const Sidebar = () => {
  const { user, isLoaded } = useUser();
  const [chats, setChats] = useState<{ id: number; title: string }[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosConfig.get("/chats/");
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChats();

    // Extracting the id from the URL
    const currentPath = window.location.pathname;
    const currentChatId = parseInt(currentPath.split("/chat/")[1]);
    setActiveChatId(currentChatId);
  }, []);

  const handleChatClick = (chatId: number) => {
    setActiveChatId(chatId); // Update the active chat ID
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform bg-white shadow-md w-64 transition-all duration-300 ease-in-out z-10`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl">AI Chat</span>
        </div>

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            window.location.href = "/upload";
          }}
          className="cursor-pointer"
        >
          <IoAdd className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat History Section */}
      <div className="p-4 h-[55vh] overflow-auto">
        <ul className="space-y-1">
          {chats
            .sort((a, b) => b.id - a.id)
            .map((chat) => (
              <li key={chat.id}>
                <Link href={`/chat/${chat.id}?name=${chat.title}`}>
                  <Button
                    variant={"ghost"}
                    className={`${
                      activeChatId === chat.id
                        ? "bg-gray-200"
                        : "hover:bg-gray-300"
                    } w-full flex justify-start h-9 rounded font-normal`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    {chat.title.length > 20
                      ? `${chat.title.substring(0, 20)}...`
                      : chat.title}
                  </Button>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <div className="absolute bottom-4 flex flex-col gap-10 w-full">
        <div
          className={`px-4 py-2 bg-gray-100 mx-4 flex flex-col gap-3 rounded-lg text-center`}
        >
          <span className="text-gray-800 text-sm font-medium">
            Upgrade Plan
          </span>
          <p className="text-gray-600 text-xs">
            Upgrade for image upload, smarter AI, and more Copilot.
          </p>
          <Button>Subscribe</Button>
        </div>

        {/* User Profile Section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isLoaded ? (
              <div
                className={`w-full flex justify-between items-center px-4 py-2 first-letter: hover:bg-gray-200 transition duration-300 cursor-pointer`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.profileImageUrl}
                    alt="User Avatar"
                    className={`rounded-full w-10 h-10`}
                  />
                  <span className="text-gray-800 text-sm font-medium">
                    {user?.fullName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2">
                <Skeleton className="rounded-full w-10 h-10" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            )}
          </DropdownMenuTrigger>

          {isLoaded && (
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem asChild>
                <SignOutButton>
                  <div className="w-full flex items-center gap-4">
                    <LuLogOut /> Log out
                  </div>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
