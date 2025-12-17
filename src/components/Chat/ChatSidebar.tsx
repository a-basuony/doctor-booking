import React, { useState } from "react";
import { Search, Trash2, CheckSquare, X } from "lucide-react";
import type { Chat } from "../../types/chat";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: number | null;
  onSelectChat: (id: number) => void;
  filterMode: "all" | "unread" | "favorite";
  setFilterMode: (mode: "all" | "unread" | "favorite") => void;
  // Selection Props
  isSelectionMode: boolean;
  selectedChatIds: number[];
  onToggleSelectionMode: () => void;
  onToggleChatSelection: (id: number) => void;
  onDeleteSelected: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  filterMode,
  setFilterMode,
  isSelectionMode,
  selectedChatIds,
  onToggleSelectionMode,
  onToggleChatSelection,
  onDeleteSelected,
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
        {isSelectionMode ? (
          // Selection Mode Header
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onToggleSelectionMode}
              className="text-gray-500 hover:text-gray-700 font-medium text-sm flex items-center"
            >
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
            <span className="font-semibold text-gray-900">
              {selectedChatIds.length} Selected
            </span>
            <button
              onClick={onDeleteSelected}
              disabled={selectedChatIds.length === 0}
              className={`text-red-500 font-medium text-sm flex items-center ${
                selectedChatIds.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:text-red-700"
              }`}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </button>
          </div>
        ) : (
          // Normal Header
          <>
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
                <h1 className="text-xl font-bold font-serif text-gray-900">
                  Chat
                </h1>
              )}
            </div>

            {/* Filter Popup */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <HiOutlineAdjustmentsHorizontal className="text-xl text-gray-600" />
              </button>
              {/* Dropdown for filters */}
              <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg border border-gray-100 py-2 w-40 hidden group-hover:block z-10">
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
                <div className="h-px bg-gray-100 my-1"></div>
                <button
                  onClick={onToggleSelectionMode}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-blue-600 font-medium"
                >
                  Select Chats
                </button>
              </div>
            </div>
          </>
        )}
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
        {filteredChats.map((chat) => {
          const isSelected = selectedChatIds.includes(chat.id);

          return (
            <div
              key={chat.id}
              onClick={() => {
                if (isSelectionMode) {
                  onToggleChatSelection(chat.id);
                } else {
                  onSelectChat(chat.id);
                }
              }}
              className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer transition-colors relative
                ${
                  activeChatId === chat.id && !isSelectionMode
                    ? "bg-blue-50/50"
                    : "hover:bg-gray-50"
                }
                ${isSelected && isSelectionMode ? "bg-blue-50" : ""}
              `}
            >
              {/* Checkbox for Selection Mode */}
              {isSelectionMode && (
                <div
                  className={`flex-shrink-0 self-center mr-2 w-5 h-5 rounded border flex items-center justify-center
                      ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 bg-white"
                      }
                  `}
                >
                  {isSelected && (
                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              )}

              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {/* Online indicator */}
                {!isSelectionMode && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-semibold text-gray-900 text-[15px]">
                  {chat.fullName}
                </h3>
                {!isSelectionMode && (
                  <div className="flex items-center justify-between mt-0.5 w-full">
                    <p className="text-sm text-gray-500 truncate pr-2">
                      {chat.lastMessage}
                    </p>
                    <span className="text-xs text-blue-500 flex-shrink-0">
                      {chat.timestamp}
                    </span>
                  </div>
                )}
              </div>

              {/* Unread Badge (hidden in selection mode) */}
              {chat.unreadCount > 0 && !isSelectionMode && (
                <div className="flex flex-col items-end gap-1">
                  <span className="w-5 h-5 bg-green-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {chat.unreadCount}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebar;
