import React, { useEffect, useState } from "react";
import { supabase } from "zicarus/utils/supabase";
import { useSession } from "next-auth/react";

const NotificationIcon: React.FC = () => {
  const [messageCount, setMessageCount] = useState(0);
  const userId = useSession().data?.user?.id;

  useEffect(() => {
    const fetchMessageCount = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("receiver_id", userId);
      if (error) {
        console.error("Error fetching messages:", error);
      }
      if (data) {
        setMessageCount(data.length);
      }
    };
    void fetchMessageCount();

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "zicarus_message" },
        (payload) => {
          setMessageCount(messageCount + 1);
        },
      )
      .subscribe();
  }, []);

  return (
    <div className="fixed right-0 top-0 m-2 rounded-full bg-blue-500 p-2 text-white">
      <span className="text-xs">{messageCount}</span>
    </div>
  );
};

export default NotificationIcon;
