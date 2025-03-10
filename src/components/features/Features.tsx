import React from "react";
import { FiFileText } from "react-icons/fi";
import { IoChatbubbleOutline } from "react-icons/io5";
import { MdElectricBolt } from "react-icons/md";

export default function Features() {
  return (
    <div className="bg-indigo-900">
      <div className="max-w-screen-xl md:px-20 md:py-20 flex flex-col items-center">
        <div className="flex flex-col items-center mb-16">
          <p className="text-4xl text-white font-bold mb-4">
            Powerful Features
          </p>
          <p className="text-indigo-200">
            Transform your video content with our advanced transcription and
            interactive chat tools
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 hover:border-indigo-500 hover:shadow-lg rounded-lg p-6 transition-all duration-300">
            <div className="bg-indigo-700 h-16 w-16 rounded-lg flex items-center justify-center mb-4">
              <span className="text-indigo-200">
                <FiFileText size={40} />
              </span>
            </div>
            <p className="text-xl font-semibold text-white mb-3">Accurate Transcription</p>
            <p className="text-indigo-200">Our AI-powered system converts your videos into precise text transcriptions with high accuracy and minimal errors.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 hover:border-indigo-500 hover:shadow-lg rounded-lg p-6 transition-all duration-300">
            <div className="bg-indigo-700 h-16 w-16 rounded-lg flex items-center justify-center mb-4">
              <span className="text-indigo-200">
                <IoChatbubbleOutline size={40} />
              </span>
            </div>
            <p className="text-xl font-semibold text-white mb-3">Interactive Chat</p>
            <p className="text-indigo-200">Chat with your content directly. Ask questions and get answers based on the transcribed video content.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 hover:border-indigo-500 hover:shadow-lg rounded-lg p-6 transition-all duration-300">
            <div className="bg-indigo-700 h-16 w-16 rounded-lg flex items-center justify-center mb-4">
              <span className="text-indigo-200">
                <MdElectricBolt size={40} />
              </span>
            </div>
            <p className="text-xl font-semibold text-white mb-3">Lightning Fast</p>
            <p className="text-indigo-200">Experience rapid processing times with our optimized transcription engine, delivering results in minutes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
