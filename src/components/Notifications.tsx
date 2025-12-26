import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdDone, MdCancel, MdAccessTime, MdInfo } from "react-icons/md";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "../hooks/useNotifications";
import type { INotification } from "../types";
import toast from "react-hot-toast";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], isLoading, isError } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: INotification["type"]) => {
    const iconClasses = "w-6 h-6";
    switch (type) {
      case "upcoming":
        return <MdAccessTime className={iconClasses} />;
      case "completed":
        return <MdDone className={iconClasses} />;
      case "cancelled":
        return <MdCancel className={iconClasses} />;
      default:
        return <MdInfo className={iconClasses} />;
    }
  };

  const getNotificationBgColor = (type: INotification["type"]) => {
    switch (type) {
      case "upcoming":
        return "bg-info-50";
      case "completed":
        return "bg-success-50";
      case "cancelled":
        return "bg-error-50";
      default:
        return "bg-neutral-50";
    }
  };

  const getNotificationIconColor = (type: INotification["type"]) => {
    switch (type) {
      case "upcoming":
        return "text-info-500";
      case "completed":
        return "text-success-500";
      case "cancelled":
        return "text-error-500";
      default:
        return "text-neutral-500";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      return diffInMinutes < 1 ? "now" : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.isRead) {
      // Mark as read endpoint not available yet - just show a warning
      toast("Mark as read feature coming soon", {
        icon: "ℹ️",
      });
      markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    // Mark all as read endpoint not available yet - just show a warning
    toast("Mark all as read feature coming soon", {
      icon: "ℹ️",
    });
    markAllAsRead();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Notifications"
      >
        <IoNotificationsOutline
          className={`w-6 h-6 text-secondary-500 transition-transform ${
            isOpen ? "rotate-12" : ""
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-neutral-200 z-50 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-secondary-900">
                  Notifications
                </h3>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1 bg-neutral-25">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-primary-100 rounded-full" />
                    <div className="w-12 h-12 border-4 border-transparent border-t-primary-600 rounded-full animate-spin absolute top-0 left-0" />
                  </div>
                  <p className="text-sm font-medium text-neutral-600">
                    Loading notifications...
                  </p>
                </div>
              </div>
            ) : isError ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-3">
                  <MdCancel className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-base font-semibold text-neutral-800 mb-1">
                  Failed to load
                </p>
                <p className="text-sm text-neutral-500">
                  Please try again later
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-3">
                  <IoNotificationsOutline className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-base font-semibold text-neutral-700 mb-1">
                  No notifications
                </p>
                <p className="text-sm text-neutral-500">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.map(
                (notification: INotification, index: number) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group p-4 border-b border-neutral-100 last:border-b-0 cursor-pointer transition-all duration-200 hover:shadow-md hover:z-10 relative ${
                      !notification.isRead
                        ? "bg-gradient-to-r from-blue-50/80 to-primary-50/50 hover:from-blue-100/90 hover:to-primary-100/70"
                        : "bg-white hover:bg-neutral-50"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`${getNotificationBgColor(
                          notification.type
                        )} ${getNotificationIconColor(
                          notification.type
                        )} p-2.5 rounded-xl flex-shrink-0 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm font-bold transition-colors ${
                              !notification.isRead
                                ? "text-secondary-900"
                                : "text-secondary-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <span className="text-xs font-medium text-neutral-500 flex-shrink-0 bg-neutral-100 px-2 py-0.5 rounded-full">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p
                          className="text-sm text-neutral-600 leading-relaxed overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {notification.message}
                        </p>
                      </div>

                      {!notification.isRead && (
                        <div className="absolute top-4 right-4">
                          <div className="w-2.5 h-2.5 bg-primary-600 rounded-full shadow-lg ring-2 ring-white animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
