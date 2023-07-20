import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { IEvent } from '../../../core/interfaces';
import { EventService } from '../../../core/event.service';


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

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
     // filter(searchTerm => searchTerm.length > 0),
      startWith(''),
      tap(searchTerm => (console.log('searchTerm', searchTerm))),
      switchMap(searchTerm => this.eventService.loadEventList(searchTerm))
    )
      .subscribe(eventList => {
        this.eventList = eventList;
        console.log('eventList', eventList);
        
      });
  }
//TODO eva - search don't reload all post when delete string in search field
  ngAfterViewInit(): void {
    console.log('View was initialized');
  }

}
