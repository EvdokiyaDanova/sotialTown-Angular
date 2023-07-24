import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { IEvent } from '../../../core/interfaces';
import { EventService } from '../../../core/event.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

export interface PaginatedResponse<T>{
  results: T[];
  totalResults: number;
}
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


  
  private pageChange$ = new BehaviorSubject(undefined);

  eventList: IEvent[];
  // eventList: PaginatedResponse<IEvent>;

  readonly pageSize = 2;
  currentPage: number = 0;
  totalResults:number=0;

  searchControl = new FormControl('');
  // isFavoritePage=false;
  pageName: string;
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
      console.log("segments ", segments);
      this.pageName = segments[0]?.path;
        console.log("this.pageName ", this.pageName);

    // combineLatest([
      //   this.searchControl.valueChanges.pipe(
      //     debounceTime(300),
      //     // filter(searchTerm =>searchTerm.length > 0),
      //     startWith(''),
      //     tap(searchTerm => (console.log('searchTerm', searchTerm))
      //     )),
      //   this.pageChange$
      // ]).pipe(
      //   switchMap(([searchTerm]) => this.eventService.loadEventPaginatedList(searchTerm,this.currentPage *this.pageSize , this.pageSize))
      // )
      //   .subscribe(eventList => {
      //     this.totalResults=eventList.totalResults;
      //     this.eventList = eventList.results;
      //   });

      // combineLatest([
      //   this.searchControl.valueChanges.pipe(
      //     debounceTime(300),
      //     // filter(searchTerm =>searchTerm.length > 0),
      //     startWith(''),
      //     tap(searchTerm => (console.log('searchTerm', searchTerm))
      //     )),
      //   this.pageChange$
      // ]).pipe(
      //   switchMap(() => this.loadEventList())
      // )
      //   .subscribe(eventList => {
      //     this.totalResults=eventList.totalResults;
      //     this.eventList = eventList.results;
      //   });


      combineLatest([
        this.searchControl.valueChanges.pipe(
          debounceTime(300),
          // filter(searchTerm =>searchTerm.length > 0),
          startWith(''),
          tap(searchTerm => (console.log('searchTerm', searchTerm))
          )),
        this.pageChange$
      ]).pipe(
        switchMap(() => this.loadEventList())
      )
        .subscribe(eventList => {
          console.log ('Response', eventList)
          this.eventList = eventList.results;
          console.log('Assigned Eva', this.eventList);
        });




      // this.searchControl.valueChanges
      //   .pipe(
      //     debounceTime(300),
      //     startWith(''),
      //     tap((searchTerm) => console.log('searchTerm', searchTerm)),
      //     switchMap(() => this.loadEventList())
      //   )
      //   .subscribe((eventList) => {
      //     this.eventList = eventList;
      //   });
    });
  }

  loadEventList(): Observable<PaginatedResponse<IEvent>> {
    const searchTerm = this.searchControl.value;
    if (this.pageName === "favorite") {
      console.log('isFavoritePage');
      return this.eventService.getPaginatedFavoriteEventsForUser(this.userId, searchTerm,this.currentPage *this.pageSize , this.pageSize);
    } else if (this.pageName === "myevents") {
      console.log('isMyEventsPage');
      return this.eventService.getPaginatedCreatedEventsByUser(this.userId, searchTerm,this.currentPage *this.pageSize , this.pageSize);
    } else {
      console.log('isEventsPage');
      return this.eventService.loadEventPaginatedList(searchTerm,this.currentPage *this.pageSize , this.pageSize);
    }
  }

  // loadEventList(): Observable<IEvent[]> {
  //   const searchTerm = this.searchControl.value;
  //   if (this.pageName === "favorite") {
  //     console.log('isFavoritePage');
  //     return this.eventService.getFavoriteEventsForUser(this.userId, searchTerm);
  //   } else if (this.pageName === "myevents") {
  //     console.log('isMyEventsPage');
  //     return this.eventService.getCreatedEventsByUser(this.userId, searchTerm);
  //   } else {
  //     console.log('isEventsPage');
  //     return this.eventService.loadEventList(searchTerm);
  //   }
  // }

  ngAfterViewInit(): void {
    console.log('View was initialized');
  }
  goOnePageBack(): void {
    this.currentPage--;
    this.pageChange$.next(undefined);
  }
  
  goOnePageForward(): void {
    console.log ('ntext') ;
    this.currentPage++;
    this.pageChange$.next(undefined);
  }
}
