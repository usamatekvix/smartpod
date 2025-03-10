import { useState } from "react";
import { useVideoStore } from "@/store/useVideoStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdCloudUpload } from "react-icons/md";
import axios from "axios";

interface EditVideoModalProps {
  video: {
    id: string;
    categoryName: string;
    transcription: string;
  };
  open: boolean;
  onClose: () => void;
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({
  video,
  open,
  onClose,
}) => {
  const { updateVideo } = useVideoStore();
  const [categoryName, setCategoryName] = useState(video.categoryName);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>("Select Video");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      setLoading(true);
      if (!videoFile) return;
      const formData = new FormData();
      formData.append("categoryName", categoryName);
      formData.append("videoFile", videoFile); // Must match Django's key "videoFile"
      formData.append("url", url);
      console.log(formData);
      const token = localStorage.getItem("usertoken"); // Get token

      if (!token) {
        console.error("No access token found!");
        return;
      }
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_VIDEOCHAT_API_URL}/api/update/${video.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for form data
          },
        }
      );
      console.log(res.data);
      const updateData = res.data;
      updateData.id = video.id;
      console.log(updateData);

      const response = await axios.post(
        "http://68.183.90.48:5678/webhook/5707af03-f627-4449-af1d-f20aca509248",
        updateData
      );

      console.log(response.data);
      const transcription = res.data.transcription;

      updateVideo(video.id, { categoryName, transcription }); // Update Zustand store
      onClose();
      setCategoryName("");
      setVideoFile(null);
      setUrl("");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }

    console.log(videoFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoName(file.name);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[420px] w-full bg-gradient-to-r from-indigo-950 to-purple-900 text-indigo-200 border border-indigo-400">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Video Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-bold">Video Name</p>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="rounded-lg border-[1.5px] border-gray-500 px-2 py-[6px] outline-none bg-transparent w-full"
            />
          </div>
          <div className="relative">
            <label htmlFor="video" className="font-bold">
              Upload Video
            </label>
            {/* Hide the default file input */}
            <input
              type="file"
              accept="video/*"
              id="video"
              className="hidden"
              onChange={handleFileChange}
              required
            />
            {/* Custom styled label triggers the hidden input */}
            <label
              htmlFor="video"
              className="flex items-center justify-center border-[1.5px] border-gray-500 px-[5px] py-[6px] rounded-lg cursor-pointer"
            >
              <MdCloudUpload className="mr-3 text-2xl" />
              <span className="truncate w-40">
                {videoName.length > 16
                  ? videoName.slice(0, 16) + "..."
                  : videoName}
              </span>
            </label>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="url" className="font-bold">
              Upload Video Url
            </label>
            <input
              type="url"
              id="url"
              className="rounded-lg border-[1.5px] border-gray-500 px-2 py-[6px] outline-none bg-transparent"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="text-indigo-950"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-indigo-600 text-white hover:bg-indigo-500"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVideoModal;
