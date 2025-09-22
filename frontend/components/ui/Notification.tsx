// src/components/Notification.tsx

import { Notification as NotificationType } from "../../types/index";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface NotificationProps {
  notification: NotificationType;
}

export default function Notification({ notification }: NotificationProps) {
  const styles = {
    success: "bg-green-900/50 text-green-300 border-green-700",
    error: "bg-red-900/50 text-red-300 border-red-700",
    info: "bg-blue-900/50 text-blue-300 border-blue-700",
  };

  const Icon = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Clock size={20} />,
  };

  return (
    <div
      className={`mb-6 p-4 rounded-lg flex items-center gap-2 backdrop-blur-sm border ${
        styles[notification.type]
      }`}
    >
      {Icon[notification.type]}
      {notification.message}
    </div>
  );
}