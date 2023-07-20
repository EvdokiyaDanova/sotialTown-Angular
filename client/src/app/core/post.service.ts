import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IPost } from './interfaces';
import { tap } from 'rxjs/operators';

const apiUrl = environment.apiUrl;

@Injectable()
export class  PostService {
  postAdded: EventEmitter<void> = new EventEmitter<void>();
  likeAction: EventEmitter<void> = new EventEmitter<void>();
  dislikeAction: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  loadPostList$(eventId: string, limit?: number): Observable<IPost[]> {
    return this.http.get<IPost[]>(
      `${apiUrl}/posts/${eventId}${limit ? `?limit=${limit}` : ''}`
    ).pipe(
     // tap(result => console.log('id от заявката:', eventId)),
      tap(result => console.log('Резултат от заявката posltList:', result))
    );
  }


  addPost$(eventId: string, body: { text: string }): Observable<IPost> {
    return this.http.post<IPost>(`${apiUrl}/events/${eventId}`, body, { withCredentials: true })
      .pipe(
        tap(() => this.postAdded.emit())
      );
  }
  
  
  likePost(postId:string):Observable<void>{
    return this.http.put<void>(`${apiUrl}/likes/${postId}`,{} ,{ withCredentials: true });
  }
   dislikePost(postId:string):Observable<void>{
    return this.http.put<void>(`${apiUrl}/dislikes/${postId}`,{},{ withCredentials: true });
  }
  unlikePost(postId:string):Observable<void>{
    return this.http.put<void>(`${apiUrl}/unlike/${postId}`,{} ,{ withCredentials: true });
  }
   removeUnlikePost(postId:string):Observable<void>{
    return this.http.put<void>(`${apiUrl}/removeunlike/${postId}`,{},{ withCredentials: true });
  }
  
}
