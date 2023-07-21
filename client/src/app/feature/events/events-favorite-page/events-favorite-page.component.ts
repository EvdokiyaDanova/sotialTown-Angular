// events-favorite-page.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { EventService } from 'src/app/core/event.service';
import { IEvent } from 'src/app/core/interfaces';

@Component({
  selector: 'app-events-favorite-page',
  templateUrl: './events-favorite-page.component.html',
  styleUrls: ['./events-favorite-page.component.css']
})
export class EventsFavoritePageComponent implements OnInit {
  isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
  favoriteEvents$: Observable<IEvent[]>;

  constructor(private authService: AuthService, private eventService: EventService) {}

  ngOnInit(): void {
    // this.authService.currentUser$.subscribe((user) => {
    //   if (user) {
    //     this.favoriteEvents$ = this.eventService.getFavoriteEventsForUser(user._id);
    //   }
    // });
  }
}
