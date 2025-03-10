"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { getColumns1 } from "@/app/dashboard/chatbot/columns1";
// import { useVideoStore } from "@/store/useVideoStore";
import Chat from "@/app/dashboard/chatbot/Chat";
import axios from "axios";

interface VideoResponse {
  id: string;
  categoryName: string;
  transcription: string;
}

export default function Chatbot() {
  const [selectedVideoChat, setSelectedVideoChat] =
    useState<VideoResponse | null>(null);
  const [tableData, setTableData] = useState<VideoResponse[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("usertoken"); // Get token

        if (!token) {
          console.error("No access token found!");
          return;
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_VIDEOCHAT_API_URL}/api/view/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);

        const transformedData = res.data.map((video: VideoResponse) => ({
          id: video.id,
          categoryName: video.categoryName,
          transcription: video.transcription,
        }));

        setTableData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="my-10">
        <DataTable
          columns={getColumns1({ setSelectedVideoChat })}
          data={tableData}
        />
        {/* Chat Box Below Table */}
        {selectedVideoChat && (
          <div>
            <Chat
              video={selectedVideoChat}
              onClose={() => setSelectedVideoChat(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
