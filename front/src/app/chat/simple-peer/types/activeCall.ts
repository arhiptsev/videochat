import * as SimplePeer from "simple-peer";
import { ChatUser } from "../../types/chat-user";

export interface ActiveCall {
    id: string;
    user: ChatUser;
    remoteStream?: MediaStream;
    peer: SimplePeer.Instance;
} 