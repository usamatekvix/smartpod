"use client";

// import { ubuntu } from "@/app/fonts/Fonts";
import axios from "axios";
import React, { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import Loading from "../Loading";
import { useVideoStore } from "@/store/useVideoStore";

export default function Create() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>("Select Video");
  const [url, setUrl] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState("");
  // const { addVideo } = useVideoStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoName(file.name);
  };

  const handleSubmiteVideo = async (e: React.FormEvent) => {
    e.preventDefault();
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

        const res = await axios.post(`${process.env.NEXT_PUBLIC_VIDEOCHAT_API_URL}/api/upload/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for form data
          },
        });
      console.log(res.data);

      const response = await axios.post(
        "http://68.183.90.48:5678/webhook/5707af03-f627-4449-af1d-f20aca509248",
        res.data
      );

      console.log(response.data);


      // **Clear Input Fields**
      // addVideo({
      //   id: res.data.id,
      //   categoryName: res.data.categoryName,
      //   transcription: res.data.transcription,
      // });
      setMessage(
        "Video uploaded successfully! You can now view the video transcription"
      );
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setCategoryName(""); // Assuming you are using useState
      setVideoFile(null);
      setUrl("");
      setVideoName("Select Video"); // Reset label text

      // Optional: Reset file input field
      const fileInput = document.getElementById("video") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.error);
        setIsError(error.response?.data.error);
        setTimeout(() => {
          setIsError("");
        }, 3000);
      } else {
        setIsError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-[230px] border border-indigo-700 hover:border-indigo-500 transition-all duration-300 text-black bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg p-5 m-5 rounded-2xl flex items-center justify-center`}
    >
      <div>
        <form onSubmit={handleSubmiteVideo} className="flex space-x-8">
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="font-bold text-lg text-indigo-300">
              Video Name
            </label>
            <input
              type="text"
              id="name"
              value={categoryName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCategoryName(e.target.value);
              }}
              className="rounded-lg border-[1.5px] border-indigo-500 px-2 py-[6px] outline-none bg-transparent w-56"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="video" className="font-bold text-lg text-indigo-300">
              Upload Video
            </label>
            <div className="relative">
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
                className="flex items-center justify-center border-[1.5px] border-indigo-500 px-[5px] py-[6px] rounded-lg w-56 cursor-pointer text-indigo-200"
              >
                <MdCloudUpload className="mr-3 text-2xl" />
                <span className="truncate w-40">
                  {videoName.length > 16
                    ? videoName.slice(0, 16) + "..."
                    : videoName}
                </span>
              </label>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="url" className="font-bold text-lg text-indigo-300">
              Upload Video Url
            </label>
            <input
              type="url"
              id="url"
              className="rounded-lg border-[1.5px] border-indigo-500 px-2 py-[6px] outline-none bg-transparent w-56"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="mt-7">
            <button
              type="submit"
              className="rounded-lg px-2 py-[6px] font-semibold bg-indigo-700 hover:bg-indigo-600 w-28 text-white mt-1"
            >
              Submit
            </button>
          </div>
        </form>
        {loading && <Loading />}
        {isError !== "" && (
          <div className="text-red-500 font-semibold text-center mt-5">
            {isError}
          </div>
        )}
        {message && (
          <div className="text-green-500 font-semibold text-center mt-5">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
