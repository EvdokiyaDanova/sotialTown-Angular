import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { IEvent } from '../../../core/interfaces';
import { EventService } from '../../../core/event.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, AfterViewInit {
  // l10n = {
  //   'en': {
  //     'no-events-message': 'No events!'
  //   },
  //   'bg': {
  //     'no-events-message': 'Няма теми!'
  //   }
  // }

  // localize(key: string, l10n: Map<string, Map<string, string>>) {
  //   const local = 'bg';

  //   return l10n[local][key];
  // }

  eventList: IEvent[];

  searchControl = new FormControl('');
  // isFavoritePage=false;
  pageName:string;
  userId: string; 

  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  // ngOnInit(): void {
  //   this.searchControl.valueChanges.pipe(
  //     debounceTime(300),
  //    // filter(searchTerm => searchTerm.length > 0),
  //     startWith(''),
  //     tap(searchTerm => (console.log('searchTerm', searchTerm))),
  //     switchMap(searchTerm => this.eventService.loadEventList(searchTerm))
  //   )
  //     .subscribe(eventList => {
  //       this.eventList = eventList;
  //       console.log('eventList', eventList);
        
  //     });
  // }


 
  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user._id; // Запазваме идентификатора на текущия потребител
      }
    });

    this.route.url.subscribe((segments) => {
      console.log("segments " ,segments);
      
      //this.isFavoritePage = segments.some((segment) => segment.path === 'favorite');
      this.pageName = segments[0]?.path;
      console.log("this.pageName ", this.pageName);
      

      this.searchControl.valueChanges
        .pipe(
          debounceTime(300),
          startWith(''),
          tap((searchTerm) => console.log('searchTerm', searchTerm)),
          switchMap(() => this.loadEventList())
        )
        .subscribe((eventList) => {
          this.eventList = eventList;
        });
    });
  }

  loadEventList(): Observable<IEvent[]> {
    const searchTerm = this.searchControl.value;
    if (this.pageName ==="favorite") {
      console.log('isFavoritePage');
      return this.eventService.getFavoriteEventsForUser(this.userId, searchTerm);
    }else if(this.pageName ==="myevents"){
      console.log('isMyEventsPage');
      return this.eventService.getCreatedEventsByUser(this.userId, searchTerm);
    }else {
      console.log('isEventsPage');
      return this.eventService.loadEventList(searchTerm);
    }
  }

  ngAfterViewInit(): void {
    console.log('View was initialized');
  }

}
