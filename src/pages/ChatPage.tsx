import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatEmptyState from "../components/Chat/ChatEmptyState";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useToggleFavorite,
  useToggleArchive,
} from "../hooks/useChat";
import { Loader2 } from "lucide-react";

const ChatPage = () => {
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "unread" | "favorite" | "archived">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

  const apiFilterType =
    filterMode === "all"
      ? undefined
      : filterMode === "unread"
      ? "unread"
      : filterMode === "favorite"
      ? "favorites"
      : "archived";

  const {
    data: conversationsData,
    isLoading: isLoadingChats,
    error: chatsError,
  } = useConversations({ type: apiFilterType as any, search: searchTerm });

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(activeChatId, !!activeChatId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const toggleFavorite = useToggleFavorite();
  const toggleArchive = useToggleArchive();

  const handleToggleFavorite = () => {
    if (activeChatId) toggleFavorite.mutate(activeChatId);
  };

  const handleToggleArchive = () => {
    if (activeChatId) toggleArchive.mutate(activeChatId);
  };

  const chats = conversationsData?.data || [];
  const activeConversation = chats.find((c) => c.id === activeChatId);

  const { conversationId } = useParams<{ conversationId?: string }>();
  useEffect(() => {
    if (conversationId) {
      const id = Number(conversationId);
      if (!Number.isNaN(id)) {
        setActiveChatId(id);
        markAsRead.mutate(id);
      }
    }
  }, [conversationId]);

  const handleSelectChat = (id: number) => {
    setActiveChatId(id);
    markAsRead.mutate(id);
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatId || !text.trim()) return;

    sendMessage.mutate({ conversationId: activeChatId, body: text });
  };

  const handleSendAttachment = async (file: File) => {
    if (!activeChatId) return;
    sendMessage.mutate({ conversationId: activeChatId, body: file.name, attachment: file });
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedChatIds([]);
  };

  const toggleChatSelection = (chatId: number) => {
    setSelectedChatIds((prev) => (prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]));
  };

  const deleteSelectedChats = async () => {
    console.log("Delete chats:", selectedChatIds);
  };

  const messages = [...(messagesData?.data || [])].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const activeChatAdapter = activeConversation
    ? {
        id: activeConversation.id,
        fullName: activeConversation.other_user.name,
        avatar: activeConversation.other_user.avatar || `https://ui-avatars.com/api/?name=${activeConversation.other_user.name}`,
        messages: messages.map((msg) => ({
          id: msg.id,
          sender: msg.is_mine ? ("me" as const) : ("other" as const),
          text: msg.body,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isRead: true,
          image: msg.type === "image" ? msg.body : null,
          type: msg.type,
        })),
        lastSeen: "Online",
        isUnread: activeConversation.unread_count > 0,
        isFavorite: activeConversation.is_favorite,
        isArchived: activeConversation.is_archived,
        unreadCount: activeConversation.unread_count,
      }
    : null;

  if (isLoadingChats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (chatsError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">Error loading chats</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow flex flex-col max-w-[1440px] mx-auto w-full p-4 sm:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex h-full overflow-hidden">
          <div className={`${activeChatId ? "hidden md:flex" : "flex"} w-full md:w-auto h-full`}>
            <ChatSidebar
              conversations={chats}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              filterMode={filterMode}
              setFilterMode={setFilterMode}
              isSelectionMode={isSelectionMode}
              selectedChatIds={selectedChatIds}
              onToggleSelectionMode={toggleSelectionMode}
              onToggleChatSelection={toggleChatSelection}
              onDeleteSelected={deleteSelectedChats}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className={`${!activeChatId ? "hidden md:flex" : "flex"} flex-1 h-full relative`}>
            {isLoadingMessages && activeChatId ? (
              <div className="flex items-center justify-center w-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : activeChatAdapter ? (
              <ChatWindow
                chat={activeChatAdapter as any}
                onSendMessage={handleSendMessage}
                onSendAttachment={handleSendAttachment}
                onBack={() => setActiveChatId(null)}
                onToggleFavorite={handleToggleFavorite}
                onToggleArchive={handleToggleArchive}
                isFavorite={activeChatAdapter.isFavorite}
                isArchived={activeConversation?.is_archived}
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