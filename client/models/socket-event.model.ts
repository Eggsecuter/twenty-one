export interface SocketEventModel {
    type: SocketEventType,
    data: any
}

export enum SocketEventType {
    Join = 0,
    ChatMessage = 1
}
