"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useState } from "react";
import EditVideoModal from "./EditVideoModal"; // Create this modal component

export type VideoResponse = {
  id: string;
  categoryName: string;
  transcription: string;
};

export const columns: ColumnDef<VideoResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[16px] hover:bg-transparent hover:text-indigo-200"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.categoryName || "No Name",
  },
  {
    accessorKey: "transcription",
    header: "Transcription",
    cell: ({ row }) => {
      const transcript = row.original.transcription ?? "";
      return transcript.length > 200 ? transcript.slice(0, 200) + "..." : transcript;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const [selectedVideo, setSelectedVideo] = useState<VideoResponse | null>(null);

      return (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedVideo(row.original);
              setOpen(true);
            }}
          >
            <Pencil className="h-4 w-4 text-indigo-500 font-bold hover:text-indigo-400" />
          </Button>

          {/* Edit Modal */}
          {selectedVideo && (
            <EditVideoModal
              video={selectedVideo}
              open={open}
              onClose={() => setOpen(false)}
            />
          )}
        </>
      );
    },
  },
];
