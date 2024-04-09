import React from "react";

interface AppNotificationProps {
  message: string;
  type: "success" | "error" | "none";
}

const AppNotification: React.FC<AppNotificationProps> = ({ message, type }) => {
  if (!message) return null;

  const baseStyle = "rounded-md p-2 text-center mb-4";
  const styles = {
    success: `${baseStyle} bg-green-100 text-green-800`,
    error: `${baseStyle} bg-red-100 text-red-800`,
  };

  return (type === "none") ? null : (
    <div className={styles[type as keyof typeof styles] || baseStyle}>
      {message}
    </div>
  );
};

export default AppNotification;
