"use client";

import React, { useState } from "react";
import { CgTranscript } from "react-icons/cg";
import { IoCreateOutline } from "react-icons/io5";
import { CiVideoOn, CiViewList } from "react-icons/ci";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import Image from "next/image";

export default function SideBar() {
  const [transcriptMenu, setTranscriptMenu] = useState(false);
  const [ChatbotMenu, setChatbotMenu] = useState(false);
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex flex-col min-h-screen min-w-[220px] bg-gradient-to-br from-indigo-950 to bg-purple-950 ">
        {/* <Image
          src={"/logo2.jpg"}
          alt="logo"
          height={60}
          width={60}
          className="rounded-full mx-auto my-4"
        /> */}
        <div className="flex items-center justify-center mt-7 space-x-2 text-white mb-5">
          <span className="bg-indigo-600 rounded-md">
            <CiVideoOn size={24} />
          </span>
          <p className="font-bold text-2xl">VideoChat</p>
        </div>
        <hr className="w-[170px] ml-4 mt-2" />
        <div className="flex space-y-2 flex-col me-5 p-4 text-white">
          <div className="pb-1 mt-3">
            <div
              onClick={() => setTranscriptMenu(!transcriptMenu)}
              className="flex items-center space-x-2 cursor-pointer text-indigo-300"
            >
              <span>
                <CgTranscript />
              </span>
              <p className="font-bold text-xl">Transcription</p>
            </div>
            {transcriptMenu && (
              <div>
                <Link href={"/dashboard/transcription/create"}>
                  <div
                    className={`flex items-center font-medium mt-2 space-x-2 rounded-md py-1 pl-5 cursor-pointer text-indigo-300 ${
                      pathname === "/dashboard/transcription/create"
                        ? "bg-indigo-700"
                        : "hover:bg-indigo-700"
                    }`}
                  >
                    <span>
                      <IoCreateOutline />
                    </span>
                    <p>Create</p>
                  </div>
                </Link>
                <Link href={"/dashboard/transcription/view"}>
                  <div
                    className={`flex items-center space-x-2 mt-2 py-1 pl-5 rounded-md cursor-pointer text-indigo-300 font-medium ${
                      pathname === "/dashboard/transcription/view"
                        ? "bg-indigo-700"
                        : "hover:bg-indigo-700"
                    }`}
                  >
                    <span>
                      <CiViewList />
                    </span>
                    <p>View</p>
                  </div>
                </Link>
              </div>
            )}
          </div>
          <hr className="" />

          <div
            onClick={() => setChatbotMenu(!ChatbotMenu)}
            className="pt-1 flex items-center space-x-2 cursor-pointer text-indigo-300"
          >
            <span>
              <IoChatboxEllipsesOutline />
            </span>
            <p className="font-bold text-xl">Chatbot</p>
          </div>
          {ChatbotMenu && (
            <div>
              <Link href={"/dashboard/chatbot"}>
                <div
                  className={`flex items-center space-x-2 mt-2 py-1 pl-5 rounded-md cursor-pointer text-indigo-300 font-medium ${
                    pathname === "/dashboard/chatbot"
                      ? "bg-indigo-700"
                      : "hover:bg-indigo-700"
                  }`}
                >
                  <span>
                    <IoChatbubbleEllipsesOutline />
                  </span>
                  <p>Chat</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
