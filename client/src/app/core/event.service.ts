import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPost, IEvent, PaginatedResponse } from './interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const apiUrl = environment.apiUrl;


@Injectable()
export class EventService {

  constructor(private http: HttpClient) { }

  addEvent$(body: { newEventForm: any }): Observable<IEvent> {
    return this.http.post<IEvent>(`${apiUrl}/events`, body, { withCredentials: true });
  }

  editEvent(eventId: string, body: { newEventForm: any }): Observable<IEvent> {
    return this.http.post<IEvent>(`${apiUrl}/events/${eventId}/edit`, body, { withCredentials: true });
  }

  deleteEvent(eventId: string): Observable<IEvent> {
    return this.http.delete<IEvent>(`${apiUrl}/events/${eventId}/delete`, { withCredentials: true });
  }

  getFavoriteEventsForUser(userId: string, searchTerm: string = ''): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${apiUrl}/events?title=${searchTerm}`).pipe(
      map((events) => events.filter((event) => event.subscribers.includes(userId)))
    );
  }

  getCreatedEventsByUser(userId: string, searchTerm: string = ''): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${apiUrl}/events?title=${searchTerm}`).pipe(
      map((events) => events.filter((event) => event.userId._id == userId))
    );
  }

  loadEventList(searchTerm: string = ''): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${apiUrl}/events?title=${searchTerm}`, {});
  }

  loadEventPaginatedList(searchTerm: string = '', startIndex: number, limit: number,currPage: string,userId: string): Observable<PaginatedResponse<IEvent>> {

    return this.http.get<PaginatedResponse<IEvent>>(`${apiUrl}/events/list`, {
      params: new HttpParams({
        fromObject: {
          title: searchTerm,
          startIndex,
          limit,
          currPage,
          userId,
        }
      })
    });
  }

  loadEventById(id: string): Observable<IEvent<IPost, string>> {
    return this.http.get<IEvent<IPost, string>>(`${apiUrl}/events/${id}`);
  }

  subscribeToEvent(eventId: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${apiUrl}/events/${eventId}`, {}, { withCredentials: true });
  }

  unsubscribe(eventId: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${apiUrl}/events/${eventId}/unsubscribe`, {}, { withCredentials: true });
  }


}
