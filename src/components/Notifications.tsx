import { useState, useRef, useEffect } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { MdDone, MdCancel, MdAccessTime, MdInfo } from 'react-icons/md';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../hooks/useNotifications';
import type { INotification } from '../types';

const MOCK_NOTIFICATIONS: INotification[] = [
   {
      id: '1',
      title: 'Upcoming Appointment',
      message: 'Reminder: You have an appointment with Dr. Sarah Johnson at 2:00 PM today.',
      type: 'upcoming',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      appointmentId: 'apt-123'
   },
   {
      id: '2',
      title: 'Appointment completed',
      message: 'You have successfully booked your appointment with Dr. Emily Walker.',
      type: 'completed',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      appointmentId: 'apt-124'
   },
   {
      id: '3',
      title: 'Appointment Cancelled',
      message: 'You have successfully cancelled your appointment with Dr. David Patel.',
      type: 'cancelled',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      appointmentId: 'apt-125'
   },
   {
      id: '4',
      title: 'Prescription Ready',
      message: 'Your prescription from Dr. Michael Chen is ready for pickup.',
      type: 'info',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      appointmentId: 'apt-126'
   }
];

const Notifications = () => {
   const [isOpen, setIsOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);

   const { mutate: markAsRead } = useMarkNotificationAsRead();
   const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

   const { data = [], isLoading, isError } = useNotifications();
   console.log('Data:', data, 'Error:', isError);

   const useMockData = !data || isError || data.length === 0;
   const notifications = useMockData ? MOCK_NOTIFICATIONS : data;
   const unreadCount = notifications.filter(n => !n.isRead).length;

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isOpen]);

   const getNotificationIcon = (type: INotification['type']) => {
      const iconClasses = "w-6 h-6";
      switch (type) {
         case 'upcoming':
            return <MdAccessTime className={iconClasses} />;
         case 'completed':
            return <MdDone className={iconClasses} />;
         case 'cancelled':
            return <MdCancel className={iconClasses} />;
         default:
            return <MdInfo className={iconClasses} />;
      }
   };

   const getNotificationBgColor = (type: INotification['type']) => {
      switch (type) {
         case 'upcoming':
            return 'bg-info-50';
         case 'completed':
            return 'bg-success-50';
         case 'cancelled':
            return 'bg-error-50';
         default:
            return 'bg-neutral-50';
      }
   };

   const getNotificationIconColor = (type: INotification['type']) => {
      switch (type) {
         case 'upcoming':
            return 'text-info-500';
         case 'completed':
            return 'text-success-500';
         case 'cancelled':
            return 'text-error-500';
         default:
            return 'text-neutral-500';
      }
   };

   const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 1) {
         const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
         return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
      } else if (diffInHours < 24) {
         return `${diffInHours}h`;
      } else {
         const diffInDays = Math.floor(diffInHours / 24);
         return `${diffInDays}d`;
      }
   };

   const handleNotificationClick = (notification: INotification) => {
      if (!notification.isRead) {
         markAsRead(notification.id);
      }
   };

   const handleMarkAllAsRead = () => {
      markAllAsRead();
   };

   return (
      <div className="relative " ref={menuRef}>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2  hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Notifications"
         >
            <IoNotificationsOutline className="w-6 h-6 text-secondary-500" />
            {unreadCount > 0 && (
               <span className="absolute top-1 right-1 w-5 h-5 bg-error-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
               </span>
            )}
         </button>

         {isOpen && (<div className="absolute right-0 m-2  w-80 sm:w-96 max-w-[95vw] bg-white rounded-lg shadow-xl border border-neutral-200 z-50  max-h-[80vh]  flex flex-col"
         >
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-200">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-secondary-900">Your Notification</h3>
                  {unreadCount > 0 && (
                     <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
                     >
                        Mark all read
                     </button>
                  )}
               </div>
               {/* Mock Data Indicator */}
               {useMockData && (
                  <div className="mt-2 text-xs text-warning-700 bg-warning-50 px-2 py-1 rounded">
                     Using demo data
                  </div>
               )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
               {isLoading ? (
                  <div className="p-8 text-center text-neutral-500">
                     Loading notifications...
                  </div>
               ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-neutral-500">
                     <IoNotificationsOutline className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
                     <p>No notifications yet</p>
                  </div>
               ) : (
                  notifications.map((notification: INotification) => (
                     <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-primary-50/30' : ''
                           }`}
                     >
                        <div className="flex items-start gap-3">
                           {/* Icon */}
                           <div className={`${getNotificationBgColor(notification.type)} ${getNotificationIconColor(notification.type)} p-2 rounded-full flex-shrink-0`}>
                              {getNotificationIcon(notification.type)}
                           </div>

                           {/* Content */}
                           <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                 <h4 className="text-sm font-semibold text-secondary-900">
                                    {notification.title}
                                 </h4>
                                 <span className="text-xs text-neutral-400 flex-shrink-0">
                                    {formatTime(notification.createdAt)}
                                 </span>
                              </div>
                              <p
                                 className="text-sm text-neutral-600 mt-1 overflow-hidden"
                                 style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                 }}
                              >
                                 {notification.message}
                              </p>
                           </div>

                           {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                           )}
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>
         )}
      </div>
   );
};

export default Notifications;