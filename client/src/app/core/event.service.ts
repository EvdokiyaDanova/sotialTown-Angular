import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPost, IEvent } from './interfaces';
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


  subscribeToEvent(eventId: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${apiUrl}/events/${eventId}`,{},{ withCredentials: true });
  }
  unsubscribe(eventId: string): Observable<IEvent> {
    return this.http.put<IEvent>(`${apiUrl}/events/${eventId}/unsubscribe`,{},{ withCredentials: true });
  }



  // getFavoriteEvents(searchTerm: string = ''): Observable<IEvent[]> {
  //   return this.http.get<IEvent[]>(`${apiUrl}/events?title=${searchTerm}`, {
  //     params: new HttpParams({
  //       fromObject: {
  //       }
  //     })
  //   });
  //   // Тук трябва да направите заявка към сървъра и да филтрирате само събитията, за които текущият потребител е абониран.
  //   // Например, можете да извлечете списъка с всички събития и след това да го филтрирате с Array.filter() или други подобни методи.
  //   // Върнете само списъка със събитията, за които потребителят е абониран.
  // }

 

}
