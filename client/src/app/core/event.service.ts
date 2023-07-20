import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPost, IEvent } from './interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable()
export class EventService {

  constructor(private http: HttpClient) { }

  addEvent$(body: { eventName: string, postText: string }): Observable<IEvent> {
    return this.http.post<IEvent>(`${apiUrl}/events`, body, { withCredentials: true });
  }

  loadEventList(searchTerm: string = ''): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${apiUrl}/events?title=${searchTerm}`, {
      params: new HttpParams({
        fromObject: {
        }
      })
    });
  }

  loadEventById(id: string): Observable<IEvent<IPost>> {
    return this.http.get<IEvent<IPost>>(`${apiUrl}/events/${id}`);
  }

  // likePost(postId:string):Observable<void>{
  //   return this.http.put<void>(`${apiUrl}/likes/${postId}`,{} ,{ withCredentials: true });
  // }
  //  dislikePost(postId:string):Observable<void>{
  //   return this.http.put<void>(`${apiUrl}/dislikes/${postId}`,{},{ withCredentials: true });
  // }

  subscribeToEvent(eventId: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${apiUrl}/events/${eventId}`,{},{ withCredentials: true });
  }
  unsubscribe(eventId: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${apiUrl}/events/${eventId}/unsubscribe`,{},{ withCredentials: true });
  }

}
