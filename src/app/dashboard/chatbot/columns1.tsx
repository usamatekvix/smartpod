import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MessageCircleMore } from "lucide-react";

interface VideoResponse {
  id: string;
  categoryName: string;
  transcription: string;
}

interface ColumnsProps {
  setSelectedVideoChat: (video: VideoResponse | null) => void;
}

export const getColumns1 = ({
  setSelectedVideoChat,
}: ColumnsProps): ColumnDef<VideoResponse>[] => [
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[16px] hover:bg-transparent hover:text-indigo-200 capitalize"
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
      return transcript.length > 200
        ? transcript.slice(0, 200) + "..."
        : transcript;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSelectedVideoChat(row.original)}
      >
        <MessageCircleMore className="text-indigo-500 font-bold hover:text-indigo-400 h-4 w-4" />
      </Button>
    ),
  },
];
