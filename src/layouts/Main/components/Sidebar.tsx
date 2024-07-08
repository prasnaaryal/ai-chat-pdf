"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineBook,
  AiOutlineSetting,
} from "react-icons/ai";
import { PiUsersLight } from "react-icons/pi";
import { LuLogOut } from "react-icons/lu";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/sign-in");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform bg-white shadow-md ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 ease-in-out z-10`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between items-center border-b">
        {isOpen && (
          <div className="flex items-center space-x-2">
            {/* Replace with your logo */}
            <span className="font-bold text-xl">QuickGPT</span>
          </div>
        )}
        <Button
          onClick={toggleSidebar}
          variant="ghost"
          size="icon"
          className="p-3"
        >
          {isOpen ? (
            <AiOutlineClose className="w-5 h-5" />
          ) : (
            <AiOutlineMenu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Sidebar Menu Items */}
      <div className={`flex-1 ${isOpen ? "flex-col" : "justify-center"}`}>
        <Link
          href="/ai/chat"
          className={`py-4  flex ${
            isOpen ? "justify-start pl-4" : "justify-center"
          } items-center w-full focus:outline-none hover:bg-gray-200 transition duration-300`}
        >
          <AiOutlineSearch className="text-gray-600" />
          {isOpen && (
            <span className="text-gray-800 text-sm font-medium pl-2">
              Discover
            </span>
          )}
        </Link>

        <Link
          href="/ai/upload"
          className={`py-4 flex ${
            isOpen ? "justify-start pl-4 " : "justify-center"
          } items-center w-full focus:outline-none hover:bg-gray-200 transition duration-300`}
        >
          <AiOutlineBook className="text-gray-600" />
          {isOpen && (
            <span className="text-gray-800 text-sm font-medium pl-2">
              Library
            </span>
          )}
        </Link>

        <Link
          href="/ai/users"
          className={`py-4 flex ${
            isOpen ? "justify-start pl-4 " : "justify-center"
          } items-center w-full focus:outline-none hover:bg-gray-200 transition duration-300`}
        >
          <PiUsersLight className="text-gray-600" />
          {isOpen && (
            <span className="text-gray-800 text-sm font-medium pl-2">
              User Management
            </span>
          )}
        </Link>
      </div>

      <div className="absolute bottom-4 flex flex-col gap-10">
        <div
          className={`px-4 py-2 bg-gray-100 mx-4 flex flex-col gap-3 rounded-lg text-center ${
            isOpen ? "block" : "hidden"
          }`}
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
            <div
              className={`w-full flex ${
                isOpen ? "justify-between" : "justify-center"
              } items-center px-4 py-2 first-letter: hover:bg-gray-200 transition duration-300 cursor-pointer`}
            >
              <div className="flex items-center space-x-2">
                <img
                  src={user?.profileImageUrl}
                  alt="User Avatar"
                  className={`rounded-full w-10 ${isOpen ? "h-10" : "h-8"}`}
                />
                {isOpen && (
                  <span className="text-gray-800 text-sm font-medium">
                    {user?.fullName}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/ai/settings" className="dropdown-link">
                <div className="w-full flex items-center gap-4">
                  <AiOutlineSetting /> Settings
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <SignOutButton>
                <div className="w-full flex items-center gap-4" onClick={handleSignOut}>
                  <LuLogOut /> Log out
                </div>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
