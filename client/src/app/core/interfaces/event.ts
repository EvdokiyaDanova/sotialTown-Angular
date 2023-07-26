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
export interface IEvent<PostType = string,UserType = IUser> extends IBase {
  subscribers: string[];
  posts: PostType[];
  eventName: string;
  eventDate: Date;
  eventPlace: string;
  eventCity: string;
  eventAddress: string ;
  eventType: string;
  eventStartTime: string;
  eventDuration: number;
  eventIsLimitedGuest: boolean;
  eventNumberOfGuests: number;
  eventDescription: string;
  eventStaticPhoto: string;
  userId: UserType;
}

// Option 3
// export interface IEvent extends IBase {
//   subscribers: string[];
//   posts: (string | IPost)[];
//   eventName: string;
//   userId: IUser;
// }