import type { INotificationsResponse, INotification } from "../types";
import { api } from "./api";



export const getNotifications = async (): Promise<INotification[]> => {
   const response = await api.get<INotificationsResponse>("/notifications");
   return response.data.data;
};

export const getUnreadNotifications = async (): Promise<INotificationsResponse> => {
   const response = await api.get("/notifications/unread");
   return response.data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
   await api.post(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
   await api.post("/notifications/read-all");
};