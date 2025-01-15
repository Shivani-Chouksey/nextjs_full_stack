import { Message } from "@/modal/userModal";

export type ApiResponse = {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
};
