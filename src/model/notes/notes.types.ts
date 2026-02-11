export type Note = {
  id: number;
  user_id: number;
  conversation_id: number;
  content: string;
  source_message_index: number | null;
  created_at: string;
};

export type CreateNoteInput = {
  content: string;
  sourceMessageIndex?: number | null;
};
