"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { markNotificationAsRead } from "./actions";

export default function NotificationBell({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markNotificationAsRead(id);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-primary rounded-full border border-black shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50">
          <div className="sticky top-0 bg-black/90 p-4 border-b border-white/10 flex justify-between items-center z-10">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-semibold">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="p-2">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6">No notifications yet.</p>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-lg mb-1 transition-colors ${notif.isRead ? 'opacity-70 hover:bg-white/5' : 'bg-primary/5 hover:bg-primary/10 border border-primary/20'}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => handleMarkRead(notif.id, e)}
                        className="text-[10px] text-primary font-bold hover:underline shrink-0 ml-2"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-gray-500 mt-2">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
