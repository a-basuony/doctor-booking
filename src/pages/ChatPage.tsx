import { useState, useEffect } from "react";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatEmptyState from "../components/Chat/ChatEmptyState";
import type { Chat } from "../types/chat";
import { chatService } from "../services/chatService";

const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "unread" | "favorite">(
    "all"
  );
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getChats();
      // Ensure messages array exists
      const mappedChats = data.map((c: any) => ({
        ...c,
        messages: c.messages || [],
        // Ensure other fields are present to avoid runtime errors if API differs
        unreadCount: c.unreadCount || c.unread_count || 0,
        fullName: c.fullName || c.full_name || "User",
        lastMessage: c.lastMessage || c.last_message || "",
        timestamp: c.timestamp || "",
        avatar: c.avatar || "https://i.pravatar.cc/150",
        isFavorite: c.isFavorite || c.is_favorite || false,
        isUnread:
          c.isUnread ||
          c.is_unread ||
          c.unreadCount ||
          c.unread_count > 0 ||
          false,
        lastSeen: c.lastSeen || c.last_seen || "Offline",
      }));

      // --- TEMPORARY: Add Mock Chats for Testing ---
      const temporaryMockChats: Chat[] = [
        {
          id: 9991,
          fullName: "Dr. Mock Test",
          avatar: "https://i.pravatar.cc/150?img=11",
          lastMessage: "Hello, this is a test chat pending real API data.",
          unreadCount: 2,
          isFavorite: true,
          isUnread: true,
          timestamp: "10:30 AM",
          lastSeen: "Online",
          messages: [
            {
              id: 1,
              sender: "other",
              text: "Hello, this is a test chat pending real API data.",
              time: "10:30 AM",
              isRead: false,
            },
          ],
        },
        {
          id: 9992,
          fullName: "Dr. Virtual Support",
          avatar: "https://i.pravatar.cc/150?img=5",
          lastMessage: "How can I help you today?",
          unreadCount: 0,
          isFavorite: false,
          isUnread: false,
          timestamp: "Yesterday",
          lastSeen: "Last seen yesterday",
          messages: [
            {
              id: 1,
              sender: "other",
              text: "Welcome to support.",
              time: "9:00 AM",
              isRead: true,
            },
            {
              id: 2,
              sender: "other",
              text: "How can I help you today?",
              time: "9:05 AM",
              isRead: true,
            },
          ],
        },
      ];
      setChats([...temporaryMockChats, ...mappedChats]);
      // ---------------------------------------------
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChat = async (id: number) => {
    setActiveChatId(id);

    // If it's a mock chat (ID > 9000), don't fetch from API
    if (id > 9000) {
      return;
    }

    // Optimistic or just fetch
    try {
      const response = await chatService.getMessages(id);
      const messages = Array.isArray(response) ? response : response.data || [];

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === id) {
            return {
              ...chat,
              messages: messages,
              unreadCount: 0, // Mark as read locally
              isUnread: false,
            };
          }
          return chat;
        })
      );

      // Also mark as read on server
      chatService.markMessagesAsRead(id);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSendMessage = async (text: string) => {
    if (!activeChatId) return;

    // Optimistic update
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      sender: "me" as const,
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: true,
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
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

    // If it's a mock chat, stop here (don't send to API)
    if (activeChatId > 9000) {
      return;
    }

    try {
      // Send to API
      // Adjust payload based on what API expects. Assuming { message: text, chat_id: id } or similar
      const sentMessage = await chatService.sendMessage({
        chat_id: activeChatId, // or user_id depending on API
        user_id: activeChatId, // This might differ if chat_id != user_id
        message: text,
      });

      // Update with real ID and data from server
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            const updatedMessages = chat.messages.map((m) =>
              m.id === tempId ? { ...m, ...sentMessage } : m
            );
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert or show error
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!activeChatId) return;

    // Optimistic update
    const previousChats = [...chats];
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

    // If it's a mock chat, stop here
    if (activeChatId > 9000) return;

    try {
      await chatService.deleteMessage(activeChatId, messageId);
    } catch (error) {
      console.error("Failed to delete message:", error);
      setChats(previousChats); // Revert
    }
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

  const deleteSelectedChats = async () => {
    // Optimistic
    const previousChats = [...chats];
    setChats((prev) => prev.filter((c) => !selectedChatIds.includes(c.id)));
    if (activeChatId && selectedChatIds.includes(activeChatId)) {
      setActiveChatId(null);
    }
    setIsSelectionMode(false);

    try {
      await Promise.all(
        selectedChatIds.map((id) => chatService.deleteChat(id))
      );
      setSelectedChatIds([]);
    } catch (error) {
      console.error("Failed to delete chats:", error);
      setChats(previousChats);
      // Optional: show toast
    }
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
              onSelectChat={handleSelectChat}
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
