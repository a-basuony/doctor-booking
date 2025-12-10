import React, { useState } from "react";
import { Search } from "lucide-react";
import type { Chat } from "../../types/chat";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  filterMode: "all" | "unread" | "favorite";
  setFilterMode: (mode: "all" | "unread" | "favorite") => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  filterMode,
  setFilterMode,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) => {
    // 1. Filter by mode
    if (filterMode === "unread" && !chat.isUnread) return false;
    if (filterMode === "favorite" && !chat.isFavorite) return false;

    // 2. Filter by search
    if (
      searchTerm &&
      !chat.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const getHeaderTitle = () => {
    switch (filterMode) {
      case "unread":
        return "Unread";
      case "favorite":
        return "Favorite";
      default:
        return "Chat";
    }
  };

  return (
    <div className="w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 bg-white flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between h-[72px]">
        <div className="flex items-center gap-2">
          {filterMode !== "all" ? (
            <button
              onClick={() => setFilterMode("all")}
              className="flex items-center text-xl font-medium font-serif"
            >
              <IoIosArrowBack className="mr-1" />
              {getHeaderTitle()}
            </button>
          ) : (
            <h1 className="text-xl font-bold font-serif text-gray-900">Chat</h1>
          )}
        </div>

        {/* Filter Popup/Icon - simplified for now */}
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <HiOutlineAdjustmentsHorizontal className="text-xl text-gray-600" />
          </button>
          {/* Dropdown for filters */}
          <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border border-gray-100 py-2 w-32 hidden group-hover:block z-10">
            <button
              onClick={() => setFilterMode("all")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              All Chats
            </button>
            <button
              onClick={() => setFilterMode("unread")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Unread
            </button>
            <button
              onClick={() => setFilterMode("favorite")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Favorites
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for chat, doctor"
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-100 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer transition-colors
              ${activeChatId === chat.id ? "bg-blue-50/50" : "hover:bg-gray-50"}
            `}
          >
            <div className="relative">
              <img
                src={chat.avatar}
                alt={chat.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Online indicator (mock) */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-gray-900 text-[15px]">
                  {chat.fullName}
                </h3>
                <span
                  className={`text-xs ${
                    chat.unreadCount > 0
                      ? "text-green-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {chat.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate pr-4 leading-relaxed">
                {chat.lastMessage}
              </p>
            </div>

            {chat.unreadCount > 0 && (
              <div className="flex flex-col items-end gap-1">
                <span className="w-5 h-5 bg-green-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {chat.unreadCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
