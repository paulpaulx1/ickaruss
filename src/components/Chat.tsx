import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "zicarus/utils/supabase";
import { Button } from "./ui/button";

type Message = {
  id: number;
  content: string;
  created_at: string;
  sender_id: string;
  sender_name: string;
};

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: number;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  conversationId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const fetchMessages = useCallback(() => {
    try {
      void supabase
        .from("zicuras_message")
        .select()
        .eq("conversation_id", conversationId)
        .then(({ data: messagesData, error }) => {
          if (error) {
            console.error("Error fetching messages:", error);
          } else {
            setMessages(messagesData || []);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }, [conversationId]) ;

  const sendMessage = async (content: string) => {
    if (!userId || !content.trim()) return;

    try {
      const { data: newMessage, error: messageError } = await supabase
        .from("zicuras_message")
        .insert([
          {
            conversation_id: conversationId,
            sender_id: userId,
            content,
          },
        ])
        .single();

      if (messageError) {
        console.error("Error sending message:", messageError);
        return;
      }

      const { error: updateError } = await supabase
        .from("zicuras_conversation")
        .update({ last_message_id: (newMessage as Message).id })
        .eq("id", conversationId);

      if (updateError) {
        console.error(
          "Error updating conversation with last message ID:",
          updateError,
        );
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      console.error("sendMessage error:", error);
    }
  };

  const subscribeToNewMessages = useCallback(() => {
    const subscription = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "zicuras_message",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: { new: Message }) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        },
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [conversationId]);

  useEffect(() => {
    if (isOpen) {
      void fetchMessages();
      const unsubscribe = subscribeToNewMessages();
      return () => {
        void unsubscribe();
      };
    }
  }, [isOpen, conversationId, fetchMessages, subscribeToNewMessages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 flex w-96 max-w-xs flex-col rounded-lg bg-white shadow-lg">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button onClick={onClose}>Close Chat</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="text-sm text-gray-400">
              {new Date(message.created_at).toLocaleTimeString()}
            </div>
            <div
              className={`flex items-end ${message.sender_id === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded px-4 py-2 ${message.sender_id === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <input
          type="text"
          className="w-full rounded-md border p-2"
          placeholder="Type your message here..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              void sendMessage(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatModal;
