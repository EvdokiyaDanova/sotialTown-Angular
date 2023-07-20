import { IBase } from './base';
import { IEvent } from './event';
import { IUser } from './user';

export interface IPost extends IBase {
  likes: string[];
  unlikes:string[];
  text: string;
  userId: IUser;
  eventId: IEvent;
}
