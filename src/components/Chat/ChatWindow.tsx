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
} from "lucide-react";
import type { Chat } from "../../types/chat";
import { IoMdHappy } from "react-icons/io";
import { ImAttachment } from "react-icons/im";
import { CHAT_CONFIG } from "../../hooks/useChat";

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

  return (
    <div className="flex flex-col h-full bg-white flex-1 min-w-0 relative">
      {/* Hidden input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
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

          const getAbsoluteUrl = (path: string) => {
            if (!path || typeof path !== "string") return "";
            let finalPath = path.trim();

            // Only strip trailing punctuation if it looks like a sentence-ending in text
            // but if it's the ONLY thing in the message or from msg.image, trust it.
            if (
              msg.image !== path &&
              finalPath.length < msg.text.trim().length
            ) {
              finalPath = finalPath.replace(/[.,!?;:]+$/, "");
            }

            if (finalPath.startsWith("http")) return finalPath;

            const baseUrl = CHAT_CONFIG.BASE_URL.replace(/\/$/, "");
            const cleanPath = finalPath.startsWith("/")
              ? finalPath
              : `/${finalPath}`;
            return `${baseUrl}${cleanPath}`;
          };

          // Permissive check for image content
          const isImageUrl = (text: string) => {
            if (!text || typeof text !== "string") return false;
            const t = text.toLowerCase();
            return (
              t.includes("/storage/") ||
              t.includes("chat_media") ||
              /\.(jpeg|jpg|gif|png|webp|svg)/i.test(t)
            );
          };

          const isLink = (text: string) => {
            return text && text.trim().startsWith("http");
          };

          // Prioritize the full image URL from msg.image if it exists
          const displayImageUrlSource =
            msg.image ||
            (isLink(msg.text) && isImageUrl(msg.text) ? msg.text.trim() : null);
          const shouldRenderImage = !!displayImageUrlSource;
          const absoluteImageUrl = shouldRenderImage
            ? getAbsoluteUrl(displayImageUrlSource)
            : null;

          return (
            <div
              key={msg.id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              } group relative`}
            >
              <div
                className={`max-w-[70%] sm:max-w-[60%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed relative
                  ${
                    isMe
                      ? "bg-[#145db8] text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
                  }
                `}
              >
                {shouldRenderImage && absoluteImageUrl ? (
                  <div className="flex flex-col gap-2">
                    <img
                      src={encodeURI(absoluteImageUrl)}
                      alt="shared image"
                      className="rounded-lg max-w-full h-auto object-cover"
                      style={{ maxHeight: "400px", minWidth: "100px" }}
                      onError={() => {
                        console.warn("Image failed to load:", absoluteImageUrl);
                      }}
                    />
                  </div>
                ) : (
                  <p className="break-words">{msg.text}</p>
                )}

                <div className="flex items-center justify-end gap-1 mt-1">
                  {(isLink(msg.text) || msg.image) && (
                    <CheckCircle2
                      className={`w-3 h-3 ${
                        isMe ? "text-blue-200" : "text-blue-500"
                      }`}
                    />
                  )}
                  <span
                    className={`text-[10px] block ${
                      isMe ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3">
          <button className="text-gray-400 hover:text-gray-600">
            <IoMdHappy className="w-6 h-6" />
          </button>

          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-gray-700"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleAttachmentClick}
            className="text-gray-400 hover:text-gray-600"
          >
            <ImAttachment className="w-5 h-5" />
          </button>

          <button
            onClick={handleSend}
            className={`p-2 rounded-full ${
              messageText.trim() ? "text-blue-600 bg-blue-50" : "text-gray-400"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
