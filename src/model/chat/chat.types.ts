export type Conversation = {
  id: number;
  user_id: number;
  title: string | null;
};

export type Message = {
  id: number;
  conversation_id: number;
  sender: "user" | "assistant";
  content: string;
  order_index: number;
};
