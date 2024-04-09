import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "../utils/supabase";
import ChatModal from "./Chat";
import { Button } from "./ui/button";
import { Conversation } from "@/types/conversation";

interface InitiateConversationProps {
  vendorUserId: string;
}

const InitiateConversation: React.FC<InitiateConversationProps> = ({
  vendorUserId,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    const findOrCreateConversation = async () => {
      if (!userId || !vendorUserId) return;

      try {
        const { data: existingConversations } = (await supabase
          .from("zicuras_conversation")
          .select("id")
          .eq("participant_one_id", userId)
          .eq("participant_two_id", vendorUserId)
          .single()) as { data: Conversation };

        if (!existingConversations) {
          const { data: newConversation } = (await supabase
            .from("zicuras_conversation")
            .insert([
              { participant_one_id: userId, participant_two_id: vendorUserId },
            ])
            .select()
            .single()) as { data: Conversation };

          setConversationId(newConversation.id);
        } else {
          setConversationId(existingConversations.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isChatOpen) {
      findOrCreateConversation().catch(console.error);
    }
  }, [isChatOpen, userId, vendorUserId]);

  const handleInitiateConversation = () => {
    setIsChatOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleInitiateConversation}
        disabled={!userId || !vendorUserId}
      >
        Send Message
      </Button>
      {isChatOpen && conversationId && (
        <ChatModal
          isOpen={isChatOpen}
          conversationId={conversationId}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
};

export default InitiateConversation;
