import { useState } from "react";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatEmptyState from "../components/Chat/ChatEmptyState";
import { mockChats } from "../data/chatData";
import type { Chat } from "../types/chat";

const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "unread" | "favorite">(
    "all"
  );
  // Initialize state with mock data
  const [chats, setChats] = useState<Chat[]>(mockChats);

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSendMessage = (text: string) => {
    if (!activeChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          const newMessage = {
            id: Date.now(), // simple unique id
            sender: "me" as const,
            text,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isRead: true,
          };
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: text,
            timestamp: "Just now",
          };
        }
        return chat;
      })
    );
  };

  const handleDeleteMessage = (messageId: number) => {
    if (!activeChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          const updatedMessages = chat.messages.filter(
            (m) => m.id !== messageId
          );
          const lastMsg =
            updatedMessages.length > 0
              ? updatedMessages[updatedMessages.length - 1].text
              : "No messages";

          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: lastMsg,
          };
        }
        return chat;
      })
    );
  };

  // --- Bulk Deletion Logic ---

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedChatIds([]); // clear selection on toggle
  };

  const toggleChatSelection = (chatId: number) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const deleteSelectedChats = () => {
    setChats((prev) => prev.filter((c) => !selectedChatIds.includes(c.id)));

    // If active chat was deleted, deselect it
    if (activeChatId && selectedChatIds.includes(activeChatId)) {
      setActiveChatId(null);
    }

    setIsSelectionMode(false);
    setSelectedChatIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-[1440px] mx-auto w-full p-4 sm:p-6 lg:p-8 h-[calc(100vh-80px)]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex h-full overflow-hidden">
          {/* Sidebar */}
          <div
            className={`${
              activeChatId ? "hidden md:flex" : "flex"
            } w-full md:w-auto h-full`}
          >
            <ChatSidebar
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
              // Selection Props
              isSelectionMode={isSelectionMode}
              selectedChatIds={selectedChatIds}
              onToggleSelectionMode={toggleSelectionMode}
              onToggleChatSelection={toggleChatSelection}
              onDeleteSelected={deleteSelectedChats}
            />
          </div>

          {/* Chat Window or Empty State */}
          <div
            className={`${
              !activeChatId ? "hidden md:flex" : "flex"
            } flex-1 h-full`}
          >
            {activeChat ? (
              <ChatWindow
                chat={activeChat}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onBack={() => setActiveChatId(null)}
              />
            ) : (
              <ChatEmptyState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
