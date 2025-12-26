import type {
  INotificationsResponse,
  INotification,
  INotificationRaw,
  INotificationData,
} from "../types";
import { api } from "./api";

// Transform raw notification to client-side format
const transformNotification = (raw: INotificationRaw): INotification => {
  // Parse the stringified JSON data
  let parsedData: INotificationData;
  try {
    parsedData = JSON.parse(raw.data);
  } catch (error) {
    console.error("Failed to parse notification data:", error);
    parsedData = { type: "info", message: raw.data };
  }

  // Map notification type to UI categories
  const typeMap: Record<
    string,
    "upcoming" | "completed" | "cancelled" | "info"
  > = {
    "Test Results": "info",
    "Appointment Reminder": "upcoming",
    "Reminder": "upcoming",
    "Appointment Completed": "completed",
    "Appointment Confirmed": "completed",
    "Appointment Cancelled": "cancelled",
    "New Prescription": "info",
    "Feedback Request": "info",
  };

  return {
    id: raw.id,
    title: parsedData.type || "Notification",
    message: parsedData.message,
    type: typeMap[parsedData.type] || "info",
    isRead: raw.read_at !== null,
    createdAt: new Date().toISOString(), // Use current date since API doesn't provide created_at
  };
};

export const getNotifications = async (): Promise<INotification[]> => {
  const response = await api.get<INotificationsResponse>("/notifications");
  console.log("Notifications API Response:", response.data);
  return response.data.notifications.map(transformNotification);
};

export const getUnreadNotifications = async (): Promise<INotification[]> => {
  const response = await api.get<INotificationsResponse>("/notifications/unread");
  return response.data.notifications.map(transformNotification);
};

// Note: These endpoints don't exist in the API yet
// Keeping as no-op functions to prevent errors
export const markNotificationAsRead = async (id: string): Promise<void> => {
  console.warn(`markNotificationAsRead endpoint not available yet for notification ${id}`);
  // TODO: Implement when backend endpoint is ready
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  console.warn("markAllNotificationsAsRead endpoint not available yet");
  // TODO: Implement when backend endpoint is ready
};
