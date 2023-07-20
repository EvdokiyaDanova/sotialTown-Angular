import { IBase } from './base';
import { IPost } from './post';
import { IUser } from './user';


// Option 1
// export interface IEvent extends IBase {
//   subscribers: string[];
//   posts: string[];
//   eventName: string;
//   userId: IUser;
// }

// export interface IEventWithPost extends IBase {
//   subscribers: string[];
//   posts: IPost[];
//   eventName: string;
//   userId: IUser;
// }


// Option 2
export interface IEvent<T = string> extends IBase {
  subscribers: string[];
  posts: T[];
  eventName: string;
  userId: IUser;
}

// Option 3
// export interface IEvent extends IBase {
//   subscribers: string[];
//   posts: (string | IPost)[];
//   eventName: string;
//   userId: IUser;
// }