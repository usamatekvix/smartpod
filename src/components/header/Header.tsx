"use client";
import useUserState from "@/store/authStore";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

export default function Header() {
  const { setUsername, username, logout } = useUserState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("username");
      if (savedUsername) {
        setUsername(savedUsername); // Set the username from localStorage if it exists
      }
    }
  }, [setUsername]);

  return (
    <div className="bg-gradient-to-br from-purple-950 to bg-indigo-950 h-20  px-4 mt-4 font-medium rounded-xl text-white flex justify-center border-b border-indigo-800">
      <div className="flex justify-between items-center w-full">
        <p className="text-indigo-300 font-bold text-xl">DASHBOARD</p>
        <div>
          {username && (
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-indigo-700 capitalize hover:bg-indigo-600 text-white font-semibold rounded-lg px-3 py-2">
                Hi, {username}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-gray-600">
                <Link href={"/"}>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-white font-bold flex justify-center px-0 py-1"
                  >
                    Logout
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* <p className="text-[13px]">Administrator</p> */}
        </div>
      </div>
      {/* <div className="flex items-center space-x-2 p-4 text-white">
        <img
          // src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
          src="/agentlogo.png"
          alt="profile"
          className="h-14 w-14 rounded-full"
        />
       
      </div> */}
    </div>
  );
}
