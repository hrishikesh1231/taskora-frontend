

import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotificationsPage.css";
import { NotificationContext } from "../context/NotificationContext";

const NotificationsPage = () => {
  const {
    notifications,
    setNotifications,
    fetchNotifications,
  } = useContext(NotificationContext);

  const navigate = useNavigate();

  // ================= FETCH ON LOAD =================
  useEffect(() => {
    fetchNotifications();
  }, []);

  // ================= MARK ONE AS READ =================
  const markAsRead = async (id) => {
    try {
      await axios.post(
        `https://taskora-backend-aejx.onrender.com/api/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );

      // Update global state instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  // ================= MARK ALL AS READ =================
  const markAllAsRead = async () => {
    try {
      await axios.post(
        "https://taskora-backend-aejx.onrender.com/api/notifications/read-all",
        {},
        { withCredentials: true }
      );

      // Update global state instantly
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  // ================= DELETE ONE =================
  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `https://taskora-backend-aejx.onrender.com/api/notifications/${id}`,
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  // ================= DELETE ALL =================
  const deleteAll = async () => {
    try {
      await axios.delete(
        "https://taskora-backend-aejx.onrender.com/api/notifications",
        { withCredentials: true }
      );

      setNotifications([]);
    } catch (err) {
      console.error("Delete all error:", err);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-card">
        <h2>Notifications</h2>

        {/* Mark All Button */}
        {notifications.some((n) => !n.isRead) && (
          <button
            className="mark-all-btn"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        )}

        {notifications.length === 0 ? (
          <p className="text-muted">No notifications</p>
        ) : (
          <>
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`notif-row ${!n.isRead ? "unread" : ""}`}
              >
                <div
                  className="notif-content"
                  onClick={() => {
                    if (!n.isRead) markAsRead(n._id);
                    if (n.link) navigate(n.link);
                  }}
                >
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>

                  <small>
                    {new Date(n.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </small>
                </div>

                {/* Mark Single Button */}
                {!n.isRead && (
                  <button
                    className="mark-read-btn"
                    onClick={() => markAsRead(n._id)}
                  >
                    Mark as Read
                  </button>
                )}

                {/* Delete Button */}
                <button
                  className="notify-delete-btn"
                  onClick={() => deleteNotification(n._id)}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Delete All */}
            <button
              className="clear-all-btn"
              onClick={deleteAll}
            >
              Clear All Notifications
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;