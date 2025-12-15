import { useState, useEffect } from "react";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatEmptyState from "../components/Chat/ChatEmptyState";
import type { Chat } from "../types/chat";
import { chatService } from "../services/chatService";

import { toast } from "react-hot-toast";

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
      // Ensure messages array exists
      const mappedChats = data.map((c: any) => {
        // Map Messages
        const rawMessages = c.messages || [];
        const mappedMessages = rawMessages.map((msg: any) => ({
          id: msg.message_id || msg.id || Date.now(),
          // TODO: We need a way to identify 'me'. For now, if the user name is 'ahmed', let's guess,
          // or we can rely on `message_sender.id` if we knew current user id.
          // For now, assume if sender name is NOT the doctor name, it is me? Or passed from component?
          // Safest for now: default to 'other' unless we have logic.
          // Looking at screenshots: message_sender: { id: 102, name: 'ahmed' }.
          // If we don't have current user ID, we can't be sure.
          // Let's assume 'other' for everything for a moment, or check a stored userId.
          // But actually, usually in these apps, the "doctor" is the other person.
          // So if message_sender.id === c.doctor_id, it is 'other'. Else 'me'.
          sender:
            (c.doctor_id && msg.message_sender?.id === c.doctor_id) ||
            (c.doctor?.id && msg.message_sender?.id === c.doctor?.id)
              ? ("other" as const)
              : ("me" as const),
          text: msg.message_content || "",
          time: msg.message_created_at
            ? new Date(msg.message_created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          isRead: msg.message_seen === 1 || false,
          image: msg.message_file || null, // Map API file to image
        }));

        // Determine last message from messages array if not present on room
        const lastMsgObj =
          mappedMessages.length > 0
            ? mappedMessages[mappedMessages.length - 1]
            : null;

        return {
          id: c.room_id || c.id,
          doctorId: c.doctor_id || c.doctor?.id, // Store for later
          messages: mappedMessages,
          unreadCount: c.unread_count || 0,
          fullName:
            c.doctor?.doctor_name || c.doctor_name || c.full_name || "User",
          lastMessage: lastMsgObj ? lastMsgObj.text : c.last_message || "",
          timestamp: c.last_message_time
            ? new Date(c.last_message_time).toLocaleDateString()
            : lastMsgObj
            ? lastMsgObj.time
            : "",
          avatar:
            c.doctor?.image ||
            c.doctor?.avatar ||
            c.avatar ||
            `https://i.pravatar.cc/150?u=${c.room_id || c.id}`,
          isFavorite: c.isFavorite || false,
          isUnread: false, // Calculate from messages if needed
          lastSeen: c.lastSeen || "Offline",
        };
      });

      setChats(mappedChats);
      // Removed setApiStatus
    } catch (error: any) {
      console.error("Failed to load chats:", error);
      toast.error(error.message || "Failed to load chats");
    } finally {
      setIsLoading(false);
    }
  };

  // Removed apiStatus state

  const handleSelectChat = async (id: number) => {
    setActiveChatId(id);

    // Optimistic or just fetch
    try {
      const response = await chatService.getMessages(id);
      // Response is { data: any[], meta: any } - data contains raw API messages
      const rawMessages = response.data || [];

      // Find current chat to get doctorId
      const currentChat = chats.find((c) => c.id === id);
      const doctorId = currentChat?.doctorId;

      const mappedMessages = rawMessages.map((msg: any) => ({
        id: msg.message_id || msg.id || Date.now(),
        // Logic for sender: if sender id matches doctor id it's 'other', else 'me'.
        sender:
          doctorId && msg.message_sender?.id === doctorId
            ? ("other" as const)
            : ("me" as const), // Default to 'me' if it doesn't match doctor
        text: msg.message_content || msg.text || "",
        time: msg.message_created_at
          ? new Date(msg.message_created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        isRead: msg.message_seen === 1 || false,
        image: msg.message_file || null,
      }));

      // Refine sender logic using the chat object
      // const currentChat = chats.find((c) => c.id === id); // Unused
      const finalMessages = mappedMessages; // Already mapped correctly above

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === id) {
            return {
              ...chat,
              messages: finalMessages,
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
      toast.error("Failed to load messages");
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

    try {
      // Send to API
      // Based on user screenshot: payload key is 'content'
      const sentMessageRaw = await chatService.sendMessage({
        chat_id: activeChatId,
        content: text,
      });

      // Update with real ID and data from server
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            const updatedMessages = chat.messages.map((m) => {
              if (m.id === tempId) {
                // Map raw response to Message
                return {
                  ...m,
                  id: sentMessageRaw.message_id || m.id,
                  text: sentMessageRaw.message_content || m.text,
                  time: sentMessageRaw.message_created_at
                    ? new Date(
                        sentMessageRaw.message_created_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : m.time,
                  // Ensure other fields are preserved or updated if API returns them
                  isRead: sentMessageRaw.message_seen === 1 || false,
                };
              }
              return m;
            });
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        })
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      // Revert or show error
    }
  };

  const handleSendAttachment = async (file: File) => {
    if (!activeChatId) return;

    // Optimistic update (text only placeholder for now, or we could show a temp image)
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      sender: "me" as const,
      text: "Sent an image", // Placeholder text
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
            lastMessage: "Sent an image",
            timestamp: "Just now",
          };
        }
        return chat;
      })
    );

    try {
      const formData = new FormData();
      formData.append("chat_id", activeChatId.toString());
      formData.append("content", "Sent an image"); // API might require content text even for file
      formData.append("file", file); // Assuming 'file' is the key
      formData.append("type", "file");

      const sentMessageRaw = await chatService.sendMessage(formData);

      // Update with real data
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            const updatedMessages = chat.messages.map((m) => {
              if (m.id === tempId) {
                return {
                  ...m,
                  id: sentMessageRaw.message_id || m.id,
                  text: sentMessageRaw.message_content || "Sent an image", // Use API content if returned
                  time: sentMessageRaw.message_created_at
                    ? new Date(
                        sentMessageRaw.message_created_at
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : m.time,
                  isRead: sentMessageRaw.message_seen === 1 || false,
                };
              }
              return m;
            });
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        })
      );
      toast.success("Image sent");
    } catch (error) {
      console.error("Failed to send image:", error);
      toast.error("Failed to send image");
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

    try {
      await chatService.deleteMessage(activeChatId, messageId);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
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
      toast.success("Chats deleted successfully");
    } catch (error) {
      console.error("Failed to delete chats:", error);
      setChats(previousChats);
      toast.error("Failed to delete chats");
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
                onSendAttachment={handleSendAttachment}
                onDeleteMessage={handleDeleteMessage}
                onBack={() => setActiveChatId(null)}
              />
            ) : (
              <ChatEmptyState />
            )}
          </div>
        </div>
      </main>
      {/* Removed debug div */}
    </div>
  );
};

export default ChatPage;
