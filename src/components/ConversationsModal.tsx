import React, { useState } from "react";
import { useFetchConversations } from "zicarus/hooks/useFetchConversations"; // Import the custom hook
import ChatModal from "./Chat";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

const ConversationsModal = () => {
  const userId = useSession().data?.user.id
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const { conversations, loading, error } = useFetchConversations(userId!);

  const toggleModal = () => setIsOpen(!isOpen);

  const openChat = (conversationId: number) => {
    setActiveConversationId(conversationId);
  };

  return (
    userId ? (
    <div className="fixed bottom-0 right-0 m-4">
      <Button
        onClick={toggleModal}
        className={isOpen? 'invisible' : ''}
      >
        {isOpen ? null : <span className="mr-2">Open Messages</span>}
        
      </Button>


      {isOpen && (
        <div className="mt-4 w-96 max-w-xs rounded-lg bg-white shadow-lg">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <Button
            className="max-w-48"
              onClick={toggleModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 14H4v-4h16v4z"
                />
              </svg>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p>Loading conversations...</p>
            ) : error ? (
              <p>Error fetching conversations.</p>
            ) : (
              conversations.map((conversation) => {
                const otherParticipantId =
                  conversation.participant_one_id === userId
                    ? conversation.participant_two_username
                    : conversation.participant_one_username;
                return (
                  <div key={conversation.id} className="p-2 hover:bg-gray-50 max-w[100%]">
                    <button
                      className={" max-w[100%] flex"}
                      onClick={() => openChat(conversation.id)}
                    >
                      Conversation with {otherParticipantId}
                    </button>
                    {/* {conversation?.lastMessage[0] && (
                        <p className="text-sm text-gray-600">
                          {conversation.lastMessage[0].content}
                        </p>
                      )} */}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      {activeConversationId && (
        <ChatModal
          isOpen={true}
          conversationId={activeConversationId}
          onClose={() => {
            setActiveConversationId(null);
          }}
        />
      )}
    </div>
  ) : null
  )
};

export default ConversationsModal;
