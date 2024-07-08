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
  AiOutlineSearch,
  AiOutlineBook,
  AiOutlineSetting,
} from "react-icons/ai";
import { PiUsersLight } from "react-icons/pi";
import { LuLogOut } from "react-icons/lu";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";

const Sidebar = () => {
  const { user } = useUser();

  return (
    <div
      className={`fixed inset-y-0 left-0 transform bg-white shadow-md w-64 transition-all duration-300 ease-in-out z-10`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
          {/* Replace with your logo */}
          <span className="font-bold text-xl">AI Chat</span>
        </div>
      </div>

      <div className="absolute bottom-4 flex flex-col gap-10">
        <div
          className={`px-4 py-2 bg-gray-100 mx-4 flex flex-col gap-3 rounded-lg text-center block`}
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
                <div className="w-full flex items-center gap-4">
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
