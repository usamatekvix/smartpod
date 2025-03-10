import React from "react";

export default function WorkFlow() {
  return (
    <div className="bg-indigo-950">
      <div className="max-w-screen-xl md:px-20 md:py-20 flex flex-col items-center">
        <div className="flex flex-col items-center mb-16">
          <p className="text-4xl text-white font-bold mb-4">
          How It Works
          </p>
          <p className="text-indigo-200">
          Three simple steps to unlock the power of your video content
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="bg-indigo-700 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-indigo-200 text-2xl font-bold">1</span>
            </div>
            <p className="text-xl font-semibold text-white mb-3">
              Upload Video
            </p>
            <p className="text-indigo-200 text-center">
              Upload your video file, URL, or connect your account
            </p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="bg-indigo-700 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-indigo-200 text-2xl font-bold">2</span>
            </div>
            <p className="text-xl font-semibold text-white mb-3">
              Get Transcription
            </p>
            <p className="text-indigo-200 text-center">
              Our AI processes your video and generates accurate text
            </p>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="bg-indigo-700 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-indigo-200 text-2xl font-bold">3</span>
            </div>
            <p className="text-xl font-semibold text-white mb-3">
              Chat & Analyze
            </p>
            <p className="text-indigo-200 text-center">
              Interact with your content through our intelligent chat interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
