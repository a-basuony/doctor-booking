import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
   getNotifications,
   getUnreadNotifications,
   markNotificationAsRead,
   markAllNotificationsAsRead,
   } from '../services/notificationsService'
import type { INotification, INotificationsResponse } from '../types';




export const useNotifications = () => {
   const hasToken = !!localStorage.getItem("authToken");

   return useQuery<INotification[], Error>({
      queryKey: ['notifications', 'all'],
      queryFn: getNotifications,
      staleTime: 5 * 60 * 1000,
      enabled: hasToken, // Only fetch when user is authenticated
      retry: false, // Don't retry on failure
   });
};

export const useUnreadNotifications = () => {
   const hasToken = !!localStorage.getItem("authToken");

   return useQuery<INotificationsResponse, Error>({
      queryKey: ['notifications', 'unread'],
      queryFn: getUnreadNotifications,
      staleTime: 5 * 60 * 1000,
      enabled: hasToken, // Only fetch when user is authenticated
      retry: false, // Don't retry on failure
   });
};


export const useMarkNotificationAsRead = () => {
   const queryClient = useQueryClient();
   return useMutation<void, Error, string>({
      mutationFn: markNotificationAsRead,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
   });
};

export const useMarkAllNotificationsAsRead = () => {
   const queryClient = useQueryClient();
   return useMutation<void, Error>({
      mutationFn: markAllNotificationsAsRead,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
   });
};