import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import type { Chat } from "../../types/chat";
import { IoMdHappy } from "react-icons/io";
import { ImAttachment } from "react-icons/im";

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (text: string) => void;
  onDeleteMessage: (msgId: number) => void;
  onSendAttachment?: (file: File) => void; // Added prop
  onBack: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onSendMessage,
  onDeleteMessage,
  onSendAttachment,
  onBack,
}) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

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
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white flex-1 min-w-0 relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*" // Restrict to images for now
        onChange={handleFileChange}
      />
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 h-[72px] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Back Button (Mobile Only) */}
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
            <span className="text-xs text-gray-500">{chat.lastSeen}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <Phone className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <Video className="w-5 h-5 cursor-pointer hover:text-gray-600" />
          <MoreVertical className="w-5 h-5 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 bg-white space-y-6">
        {/* Unread Divider Example */}
        {chat.unreadCount > 0 && (
          <div className="flex items-center justify-center my-6">
            <div className="bg-gray-50 px-4 py-1 rounded-full text-xs text-gray-500 font-medium">
              Unread messages
            </div>
          </div>
        )}

        {(chat.messages || []).map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div
              key={msg.id}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              } group relative`}
            >
              {/* Delete Button (Left side for user messages, Right side for others) */}
              {isMe && (
                <button
                  onClick={() => onDeleteMessage(msg.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-400 hover:text-red-600 self-center mr-2"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div
                className={`max-w-[70%] sm:max-w-[60%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed relative
                  ${
                    isMe
                      ? "bg-[#145db8] text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-sm"
                  }
                `}
              >
                <p>{msg.text}</p>
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="attachment"
                    className="mt-2 rounded-lg max-w-full h-auto object-cover"
                    style={{ maxHeight: "200px" }}
                  />
                )}
                <span
                  className={`text-[10px] block text-right mt-1 ${
                    isMe ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {!isMe && (
                <button
                  onClick={() => onDeleteMessage(msg.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-400 hover:text-red-600 self-center ml-2"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 mt-auto bg-white z-10">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-3">
          <button className="text-gray-400 hover:text-gray-600">
            <IoMdHappy className="w-6 h-6" />
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
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
            className={`p-2 rounded-full transition-colors ${
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
