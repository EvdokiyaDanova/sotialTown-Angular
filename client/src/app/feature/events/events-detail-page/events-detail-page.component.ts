import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { IPost, IEvent, IUser } from 'src/app/core/interfaces';
import { EventService } from 'src/app/core/event.service';
import { UserService } from 'src/app/core/user.service';
import { NgForm } from '@angular/forms';
import { PostService } from 'src/app/core/post.service';
import { mergeMap, tap } from 'rxjs/operators';
import { IconService } from 'src/app/core/icon.service';

@Component({
  selector: 'app-events-detail-page',
  templateUrl: './events-detail-page.component.html',
  styleUrls: ['./events-detail-page.component.css']
})
export class EventsDetailPageComponent implements OnInit {
  icons: { [key: string]: any };

  event: IEvent<IPost, string>;
  canSubscribe: boolean = false;
  currentUser?:IUser;
  canSubmitPost: boolean = false;
  isUserOwner: boolean = false;

 isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
 refresh$= new BehaviorSubject(undefined);

// eventCreatorName: string;


  constructor(
    private activatedRoute: ActivatedRoute, 
    private eventService: EventService,
    private authService: AuthService,
    private router: Router, 
    private postService: PostService,
    private iconService: IconService) { 
      this.icons = this.iconService.getIcons();
    }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params
      .pipe(
        mergeMap(params=>{
          const eventId= params['eventId'];
          return  this.refresh$.pipe(mergeMap(()=>this.eventService.loadEventById(eventId)))
        })
      ),
      this.authService.currentUser$.pipe(
        tap(currentUser=>this.currentUser=currentUser)
      )
    ])
    .subscribe(([event, user])=>{
    //  this.eventCreatorName = event.userId?.username || '';
      this.event= event;
      console.log(event);
      
      this.canSubscribe = user && !this.event.subscribers.includes(user?._id);
      this.isUserOwner= user && this.event.userId === user._id;
    })
  

  }
  postTextChanged(event: any): void {
    this.canSubmitPost = event.target.value.trim() !== '';
  }
  submitNewPost(eventId: string, newPostForm: NgForm): void {
    if(this.canSubmitPost){
      this.postService.addPost$(eventId, newPostForm.value).subscribe({
        next: (post) => {
          newPostForm.reset(); 
           this.refresh$.next(undefined);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
   
  }


  subscribe():void{
     this.eventService.subscribeToEvent(this.event._id)
    .subscribe(()=> this.refresh$.next(undefined));
  }
  unsubscribe():void {
     this.eventService.unsubscribe(this.event._id)
    .subscribe(()=> this.refresh$.next(undefined));
  }
  deleteEvent():void {
    this.eventService.deleteEvent(this.event._id)
   .subscribe(()=> this.navigateToHome());
 }
 navigateToHome() {
  this.router.navigate(['/home']);
}
 

}
