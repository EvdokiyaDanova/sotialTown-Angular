import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { UserService } from 'src/app/core/user.service';
import { IEvent } from '../../../core/interfaces';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.css']
})
export class EventListItemComponent implements OnChanges {

  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  canSubscribe$: Observable<boolean>;

  @Input() event: IEvent;

  constructor(private authService: AuthService) { }
  // ngOnInit():void{
  //   console.log('event', this.event.eventName);
  // }

  ngOnChanges(): void {
    this.canSubscribe$ = this.authService.currentUser$.pipe(
      map((currentUser)=>{
        if(!currentUser || !this.event){
          return false;
        }
        console.log("event-list" , this.event);
        
        return !this.event.subscribers.includes(currentUser._id);
      })
    );
  }


}
