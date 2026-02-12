export type MessageSender = "user" | "assistant";

export interface Message {
  id: number;
  conversationId: number;
  sender: MessageSender;
  content: string;
  orderIndex: number;
  createdAt: Date;
}
