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

  addEvent$(body: { eventName: string, postText: string }): Observable<IEvent> {
    return this.http.post<IEvent>(`${apiUrl}/events`, body, { withCredentials: true });
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


  getPaginatedFavoriteEventsForUser(userId: string, searchTerm: string = '', startIndex: number, limit: number): Observable<PaginatedResponse<IEvent>> {
    return this.http.get<PaginatedResponse<IEvent>>(`${apiUrl}/events/list`, {
      params: new HttpParams({
        fromObject: {
          title: searchTerm,
          startIndex,
          limit
        }
      })
    }).pipe(
      map((response: PaginatedResponse<IEvent>) => {
        const filteredEvents = response.results.filter((event) => event.subscribers.includes(userId));
        return {
          results: filteredEvents,
          totalResults: filteredEvents.length
        };
      })
    );
  }


  getPaginatedCreatedEventsByUser(userId: string, searchTerm: string = '', startIndex:number, limit:number): Observable<PaginatedResponse<IEvent>> {
    return this.http.get<PaginatedResponse<IEvent>>(`${apiUrl}/events/list`, {
      params: new HttpParams({
        fromObject: {
          title: searchTerm,
          startIndex,
          limit
        }
      })
    }).pipe(
      map((response: PaginatedResponse<IEvent>) => {
        console.log ('Load EVA',response.results);
        const filteredEvents = response.results.filter((event) => event.userId?._id === userId);
        return {
          results: filteredEvents,
          totalResults: filteredEvents.length
        };
      })
    );
  }
  // getPaginatedCreatedEventsByUser(userId: string, searchTerm: string = '', startIndex: number, limit: number): Observable<PaginatedResponse<IEvent>> {

  //   return this.loadEventPaginatedList(searchTerm, startIndex, limit)
  //     .pipe(
  //       map((response: PaginatedResponse<IEvent>) => {
  //         console.log('Load EVA', response.results);
  //         const filteredEvents = response.results.filter((event) => event.userId?._id === userId);
  //         return {
  //           results: filteredEvents,
  //           totalResults: filteredEvents.length
  //         };
  //       })
  //     );
  // }

  loadEventPaginatedList(searchTerm: string = '', startIndex: number, limit: number): Observable<PaginatedResponse<IEvent>> {

    return this.http.get<PaginatedResponse<IEvent>>(`${apiUrl}/events/list`, {
      params: new HttpParams({
        fromObject: {
          title: searchTerm,
          startIndex,
          limit
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
