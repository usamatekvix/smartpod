// import Loading from "@/components/Loading";
import Loading1 from "@/components/Loading1";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface VideoResponse {
  id: string;
  categoryName: string;
  transcription: string;
}

interface ChatBoxProps {
  video: VideoResponse;
  onClose: () => void;
}

export default function Chat({ video, onClose }: ChatBoxProps) {
  const [loading, setLoading] = useState(false);
  // const [isError, setIsError] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<
    { user: string; botRes: string | null; time: string }[]
  >([]);
  const messageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const newMessage = { user: userMessage, botRes: null, time: currentTime };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setUserMessage("");
      await sendMessage(newMessage);
    }
  };

  const sendMessage = async (newMessage: {
    user: string;
    botRes: string | null;
  }) => {
    setLoading(true);
    try {
      const payload = { question: newMessage.user, id: video.id };
      console.log(payload);
      const res = await axios.post(
        `http://68.183.90.48:5678/webhook/49dc9482-b381-44ed-8b4a-0807a78096a9`,
        payload
      );
      console.log(res.data);
      const botResponse = res.data[0].output;

      // update the bot response for the latest user message
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { ...msg, botRes: botResponse }
            : msg
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { ...msg, botRes: "Sorry, something went wrong." }
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };
  const formatMessage = (message: string) => {
    return message
      .replace(/[\[(](https?:\/\/[^\s\])]+)[\])]/g, "$1") // Remove () or [] around URLs
      .replace(
        /(https?:\/\/[^\s]+)/g,
        '<br/><a href="$1" target="_blank" class="text-blue-400 underline block">$1</a>'
      ); // Add a line break before the URL
  };

  return (
    <div className="max-w-screen-sm mx-auto ">
      <div className="mt-8 rounded-xl pb-10 pt-5 bg-gradient-to-br from-purple-950 to bg-indigo-900 border border-indigo-700">
        <div className="flex justify-between items-center pr-10">
          <p className="font-bold text-2xl capitalize mx-auto text-indigo-300">
            {video.categoryName} - chatbot
          </p>
          <span onClick={() => onClose()} className="cursor-pointer">
            <IoMdClose size={24} />
          </span>
        </div>
        <div className="mt-2 border border-purple-400 rounded-xl max-w-xl h-[330px] overflow-y-auto mx-auto p-3 flex flex-col relative">
          <ScrollArea className="h-[250px]">
            {messages.map((msg, index) => (
              <div key={index} className="space-y-3 p-2 ">
                <div className="flex justify-end">
                  <div className="max-w-[60%]">
                    <p className="text-white rounded-xl px-3 py-[6px] bg-indigo-700 text-sm mr-3">
                      {msg.user}
                    </p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[60%]">
                    {msg.botRes && (
                      <p
                        className="text-white rounded-xl px-3 py-[6px] bg-purple-800 text-sm break-words overflow-hidden"
                        dangerouslySetInnerHTML={{
                          __html: formatMessage(msg.botRes),
                        }}
                      ></p>
                    )}
                  </div>
                </div>
                <div ref={messageRef}></div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center space-x-2 ml-1 w-[95%] absolute bottom-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleMessage(e); // Trigger search on Enter
                }
              }}
              disabled={loading}
              placeholder="Type a message..."
              className="rounded-lg px-3 py-2 w-full outline-none bg-indigo-800/70 text-white placeholder:text-indigo-400 border border-indigo-600"
              required
            />
            {loading ? (
              <Loading1 />
            ) : (
              <button
                onClick={handleMessage}
                className="rounded-lg px-3 py-2 font-semibold w-24 bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
