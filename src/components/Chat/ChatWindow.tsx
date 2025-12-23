import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  ArrowLeft,
  CheckCircle2,
  Star,
  Archive,
  Mic,
  Play,
} from "lucide-react";
import type { Chat } from "../../types/chat";
import { IoMdHappy } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { API_BASE_URL } from "../../services/api";

const getAbsoluteUrl = (path: string | null | undefined) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Ensure we don't have double slashes
  const cleanBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
  onSendAttachment?: (file: File) => void;
  onBack: () => void;
  onToggleFavorite?: () => void;
  onToggleArchive?: () => void;
  isFavorite?: boolean;
  isArchived?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onSendMessage,
  onSendAttachment,
  onBack,
  onToggleFavorite,
  onToggleArchive,
  isFavorite,
  isArchived,
}) => {
  const [messageText, setMessageText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText);
    setMessageText("");
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSendAttachment) {
      onSendAttachment(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice_message.webm", {
          type: "audio/webm",
        });
        if (onSendAttachment) {
          onSendAttachment(audioFile);
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to record audio messages.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-white flex-1 min-w-0 relative">
      {/* Hidden input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 h-[72px] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <img
            src={chat.avatar}
            alt={chat.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              {chat.fullName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <button
            onClick={onToggleFavorite}
            className={`p-1 rounded-full transition-colors ${
              isFavorite
                ? "text-yellow-400 fill-yellow-400"
                : "hover:text-yellow-400 hover:bg-yellow-50"
            }`}
            title={isFavorite ? "Unfavorite" : "Favorite"}
          >
            <Star className="w-5 h-5 cursor-pointer" />
          </button>
          <button
            onClick={onToggleArchive}
            className={`p-1 rounded-full transition-colors ${
              isArchived
                ? "text-blue-600"
                : "hover:text-blue-600 hover:bg-blue-50"
            }`}
            title={isArchived ? "Unarchive" : "Archive"}
          >
            <Archive className="w-5 h-5 cursor-pointer" />
          </button>
          <div className="w-px h-6 bg-gray-100 mx-1"></div>
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <Phone className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <Video className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
        {chat.unreadCount > 0 && (
          <div className="flex items-center justify-center my-6">
            <div className="bg-gray-50 px-4 py-1 rounded-full text-xs text-gray-500 font-medium">
              Unread messages
            </div>
          </div>
        )}

        {(chat.messages || []).map((msg) => {
          const isMe = msg.sender === "me";

          const renderMedia = () => {
            if (msg.type === "image" && (msg.image || msg.text)) {
              const imgSrc = getAbsoluteUrl(msg.image || msg.text);
              return (
                <img
                  src={imgSrc}
                  alt="shared"
                  className="rounded-lg max-w-full h-auto object-cover"
                  style={{ maxHeight: "300px" }}
                />
              );
            }
            if (msg.type === "video") {
              const videoSrc = getAbsoluteUrl(msg.text);
              return (
                <div className="relative group rounded-lg overflow-hidden bg-black max-w-[300px]">
                  <video
                    src={videoSrc}
                    controls
                    className="w-full h-auto"
                    style={{ maxHeight: "300px" }}
                    poster={getAbsoluteUrl(msg.image)} // Use thumbnail if available
                  />
                </div>
              );
            }
            if (msg.type === "audio") {
              const audioSrc = getAbsoluteUrl(msg.text);
              return (
                <audio
                  src={audioSrc}
                  controls
                  className="w-full max-w-[250px]"
                  style={{
                    height: "40px",
                    backgroundColor: "transparent",
                  }}
                />
              );
            }
            return <p className="break-words">{msg.text}</p>;
          };

          // Debug: Log message type for audio messages
          if (msg.type === "audio") {
            console.log("Audio message detected:", msg);
          }

          return (
            <div
              key={msg.id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              } group relative`}
            >
              {msg.type === "audio" ? (
                // Audio messages without background bubble
                <div className="flex flex-col gap-1">
                  {renderMedia()}
                  <span
                    className={`text-[10px] font-medium ${
                      isMe
                        ? "text-right text-gray-400"
                        : "text-left text-gray-500"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              ) : (
                // Regular messages with background bubble
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed relative
                    ${
                      isMe
                        ? "bg-[#1A56DB] text-white rounded-tr-none"
                        : "bg-[#F3F4F6] text-[#4B5563] rounded-tl-none border border-gray-100"
                    }
                  `}
                >
                  {renderMedia()}

                  <div
                    className={`flex items-center justify-end mt-1 ${
                      isMe ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    <span className="text-[10px] font-medium">{msg.time}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3">
          {isRecording ? (
            <div className="flex-1 flex items-center gap-4 px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                <span className="text-red-500 font-medium text-sm">
                  Recording...
                </span>
              </div>
              <span className="text-gray-600 font-mono text-sm">
                {formatDuration(recordingDuration)}
              </span>
              <div className="flex-1"></div>
              <button
                onClick={() => {
                  if (mediaRecorderRef.current) {
                    mediaRecorderRef.current.onstop = null; // Prevent sending
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                  }
                }}
                className="text-gray-400 hover:text-red-500 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <IoMdHappy className="w-6 h-6" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button
                onClick={handleAttachmentClick}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ImAttachment className="w-5 h-5" />
              </button>

              <button
                onClick={startRecording}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            onClick={isRecording ? stopRecording : handleSend}
            className={`p-2 rounded-full transition-all ${
              isRecording || messageText.trim()
                ? "text-blue-600 bg-blue-100 hover:bg-blue-200"
                : "text-gray-400"
            }`}
          >
            {isRecording ? (
              <Send className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
