import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("https://taskora-backend-aejx.onrender.com/api/notifications", {
        withCredentials: true,
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.log("Notification fetch error");
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        fetchNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};