// src/components/Notification.tsx

import { Notification as NotificationType } from "../../types/index";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface NotificationProps {
  notification: NotificationType;
}

export default function Notification({ notification }: NotificationProps) {
  const styles = {
    success: "bg-green-500/10 text-green-300 border-green-500/20",
    error: "bg-red-500/10 text-red-300 border-red-500/20",
    info: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  };

  const Icon = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Clock size={18} />,
  };

  return (
    <div
      className={`mb-6 p-3 rounded-lg flex items-center gap-2.5 backdrop-blur-sm border text-sm ${
        styles[notification.type]
      }`}
    >
      {Icon[notification.type]}
      <span>{notification.message}</span>
    </div>
  );
}