import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { Conversation } from "../types/conversation";

const useFindOrCreateConversation = (userId: string, vendorUserId: string) => {
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    const findOrCreateConversation = async () => {
      const { data: existingConversations, error: existingConversationsError } =
        await supabase
          .from("zicuras_conversation")
          .select("id")
          .eq("user_id", userId)
          .eq("vendor_user_id", vendorUserId);

      if (existingConversationsError) {
        console.error(
          "Error fetching existing conversations:",
          existingConversationsError,
        );
        return;
      }

      if (existingConversations && existingConversations.length > 0) {
        setConversationId(existingConversations[0]!.id as number);
      } else {
        const { data: newConversation, error: newConversationError } =
          await supabase
            .from("zicuras_conversation")
            .insert([{ user_id: userId, vendor_user_id: vendorUserId }])
            .single();

        if (newConversationError) {
          console.error(
            "Error creating new conversation:",
            newConversationError,
          );
          return;
        }

        if (newConversation) {
          setConversationId((newConversation as Conversation).id);
        }
      }
    };

    findOrCreateConversation().catch(console.error);
  }, [userId, vendorUserId]);

  return conversationId;
};

export default useFindOrCreateConversation;
