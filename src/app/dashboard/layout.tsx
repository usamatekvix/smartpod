import Header from "@/components/header/Header";
import SideBar from "@/components/sidebar/SideBar";
import React from "react";
import "@/app/globals.css";
import { dm_sans } from "../fonts/Fonts";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex space-x-8 bg-indigo-950">
      <div>
        <SideBar />
      </div>
      <div className={`${dm_sans.className} antialiased w-[77%] space-y-10`}>
        <Header />
        {children}
      </div>
    </div>
  );
}
