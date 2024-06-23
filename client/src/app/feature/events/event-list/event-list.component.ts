import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { IEvent, PaginatedResponse } from '../../../core/interfaces';
import { EventService } from '../../../core/event.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
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



  private pageChange$ = new BehaviorSubject(undefined);

  eventList: IEvent[];

  readonly pageSize = 2;
  currentPage: number = 0;
  totalResults: number = 0;

  searchControl = new UntypedFormControl('');

  pageName: string;
  userId: string;



  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user._id; // save current user id
      }
    });

    this.route.url.subscribe((segments) => {
      console.log("segments ", segments);
      this.pageName = segments[0]?.path;
      console.log("this.pageName ", this.pageName);
      //this.totalResults = 0;




      combineLatest([
        this.searchControl.valueChanges.pipe(
          debounceTime(300),
          // filter(searchTerm =>searchTerm.length > 0), 
          startWith(''),
          tap(() => (this.currentPage = 0)),
          tap(searchTerm => (console.log('searchTerm', searchTerm))
          )),
        this.pageChange$
      ]).pipe(
        switchMap(() => this.loadEventList())
      )
        .subscribe(eventList => {
          //get events list and number of events from PaginatedResponse<T> interface
          this.eventList = eventList.results;
          this.totalResults = eventList.totalResults;
          console.log("eventList ", eventList);

        });



      // WITHOUT PAGINATION ONINIT FUNC
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
    let currPage: string = "";
    if (this.pageName === "favorite") {
      currPage = "favorite";
    }
    if (this.pageName === "myevents") {
      currPage = "myevents";
    }
    return this.eventService.loadEventPaginatedList(searchTerm, this.currentPage * this.pageSize, this.pageSize, currPage, this.userId);
  }
  // WITHOUT PAGINATION LOAD PAGES FUNC
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
    console.log('ntext');
    this.currentPage++;
    this.pageChange$.next(undefined);
  }
}
