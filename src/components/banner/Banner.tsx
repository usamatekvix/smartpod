import React from "react";

export default function Banner() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-950 md:px-12 px-4">
      <div className="max-w-screen-xl mx-auto min-h-[70vh] flex flex-col items-center justify-center">
        <p className="font-bold text-white text-6xl text-center mb-6">
          Transform Your Videos Into <br />{" "}
          <span className="text-indigo-300">Interactive Conversations</span>
        </p>
        <p className="text-xl max-w-2xl text-indigo-200 text-center">
          Upload your video, get an accurate transcription, and chat with your
          content using our AI-powered platform.
        </p>
      </div>
    </div>
  );
}
