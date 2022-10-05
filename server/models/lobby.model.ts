import { Server } from 'ws';
import { UserModel } from './user.model';

export interface LobbyModel {
    wss: Server;
    token: string;
    users: UserModel[];
    isPrivate: boolean;
}
