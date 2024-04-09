import { useState, useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "zicarus/utils/supabase";
import { Conversation } from "zicarus/types/conversation";

export const useFetchConversations = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | PostgrestError>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!userId) {
        setConversations([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data: conversationsData, error: fetchError } = await supabase
          .from("zicuras_conversation")
          .select()
          .or(`participant_one_id.eq.${userId},participant_two_id.eq.${userId}`)
          .order("created_at", { ascending: false });

        if (fetchError) {
          setError(fetchError);
          setConversations([]);
        } else {
          const userIds = [
            ...new Set(
              conversationsData.flatMap((conv: Conversation) => [
                conv.participant_one_id,
                conv.participant_two_id,
              ] as string[]),
            ),
          ];


          const { data: usersData, error: usersError } = await supabase
            .from("zicuras_user")
            .select("id, name")
            .in("id", userIds);

          if (usersError) {
            setError(usersError);
            console.error(usersError, 'usersError');
            return;
          }

          const userIdToUsernameMap = usersData.reduce(
            (acc: Record<string, string>, user) => {
              acc[user.id as string] = user.name as string;
              return acc;
            },
            {} as Record<string, string>,
          );

          const conversationsWithUsernames = conversationsData.map((conv: Conversation) => ({
            ...conv,
            participant_one_username:
              userIdToUsernameMap[conv.participant_one_id],
            participant_two_username:
              userIdToUsernameMap[conv.participant_two_id],
          })) as Conversation[];

          setConversations(conversationsWithUsernames || []);

          setError(null);
        }
      } catch (err) {
        setError(err as PostgrestError);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations().catch(error => {console.error(error, 'error fetching conversations')});

    console.log(conversations);
  }, [userId]);

  return { conversations, loading, error };
};
