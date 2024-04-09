export interface Conversation {
    id: number;
    participant_one_id: string;
    participant_two_id: string;
    participant_one_username: string;
    participant_two_username: string;
    lastMessage: {
      content: string;
      created_at: string;
    }[];
  }

  export interface ParticipantUserNames {
    participantOneName: string;
    participantTwoName: string;
  }