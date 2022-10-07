import { UserModel } from "./user.model"

export interface SocketEventModel {
    type: SocketEventType,
    sender: UserModel,
    data: any
}

export enum SocketEventType {
    Join = 0,
    ChatMessage = 1
}
