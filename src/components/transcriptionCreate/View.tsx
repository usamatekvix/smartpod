"use client";

import React, { useEffect, useState } from "react";
import { useVideoStore } from "@/store/useVideoStore";
import { columns } from "@/app/dashboard/transcription/view/columns";
import { DataTable } from "../data-table";
import axios from "axios";

export default function View() {
  const { videos, setVideos } = useVideoStore();
  const [isFetched, setIsFetched] = useState(false); // ✅ Add fetch flag

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("usertoken");
        if (!token) {
          console.error("No access token found!");
          return;
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_VIDEOCHAT_API_URL}/api/view/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res.data);

        setVideos(res.data);
        setIsFetched(true); // ✅ Mark as fetched
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!isFetched) { // ✅ Fetch only if not already fetched
      fetchData();
    }
  }, [isFetched, setVideos]); // ✅ Only run once

  return (
    <div className="mt-10">
      <DataTable columns={columns} data={videos} />
    </div>
  );
}

