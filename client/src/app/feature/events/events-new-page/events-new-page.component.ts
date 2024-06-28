/// <reference types="@types/google.maps" />

import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { EventService } from 'src/app/core/event.service';
import { IEvent, IPost } from 'src/app/core/interfaces';

declare var google: any;

@Component({
  selector: 'app-events-new-page',
  templateUrl: './events-new-page.component.html',
  styleUrls: ['./events-new-page.component.css']
})
export class EventsNewPageComponent implements OnInit {
  eventId: string | null;
  isEditPage: boolean = false;
  event: IEvent<IPost, string>;

  eventName: string = '';
  eventDate: Date;
  eventPlace: string = '';
  eventCountry: string = '';
  eventCity: string = '';
  eventAddress: string = '';
  eventType: string = '';
  eventStartTime: string = '';
  eventDuration: number = 0;
  eventIsLimitedGuest: boolean = false;
  eventNumberOfGuests: number;
  eventDescription: string = '';
  eventStaticPhoto: string = '';
  eventVideoUrl: string = '';

  addressSuggestions: any[] = [];
  newEventForm: NgForm; // for Template Drivens Forms
  activeField: string = ''; // Track which field is active
  activeSuggestionIndex: number = -1; // Track active suggestion
  showSuggestions: boolean = false; // Track if suggestions should be shown

  constructor(
    private router: Router,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.isEditPage = !!this.eventId;

      if (this.isEditPage) {
        this.loadEvent(this.eventId);
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  submitNewEvent(newEventForm: NgForm) {
    if (newEventForm.valid) {
      if (this.isEditPage) {
        this.updateEvent(this.eventId, newEventForm);
      } else {
        this.createEvent(newEventForm);
      }
    }
  }

  loadEvent(eventId: string) {
    this.activatedRoute.params
      .pipe(
        mergeMap(params => {
          const eventId = params['eventId'];
          return this.eventService.loadEventById(eventId);
        })
      )
      .subscribe((event) => {
        this.event = event;
        this.eventName = event.eventName;
        this.eventDate = event.eventDate;
        this.eventPlace = event.eventPlace;
        this.eventCountry = event.eventCountry;
        this.eventCity = event.eventCity;
        this.eventAddress = event.eventAddress;
        this.eventType = event.eventType;
        this.eventStartTime = event.eventStartTime;
        this.eventDuration = event.eventDuration;
        this.eventIsLimitedGuest = event.eventIsLimitedGuest;
        this.eventNumberOfGuests = event.eventNumberOfGuests;
        this.eventDescription = event.eventDescription;
        this.eventStaticPhoto = event.eventStaticPhoto;
        this.eventVideoUrl = event.eventVideoUrl;
      });
  }

  createEvent(newEventForm: any) {
    this.eventService.addEvent$(newEventForm.value).subscribe({
      next: (event) => {
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  updateEvent(eventId: string, newEventForm: any) {
    this.eventService.editEvent(eventId, newEventForm.value).subscribe({
      next: (event) => {
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getSuggestions(query: string, field: string) {
    this.activeField = field;
    if (query.length > 2) {
      this.eventService.getPlacePredictions(query).subscribe(suggestions => {
        this.ngZone.run(() => {
          this.addressSuggestions = suggestions;
          this.activeSuggestionIndex = -1; // Reset the active suggestion index
          this.showSuggestions = true;
        });
      });
    } else {
      this.addressSuggestions = [];
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: any) {
    const placeService = new google.maps.places.PlacesService(document.createElement('div'));
    placeService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
      this.ngZone.run(() => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if (this.activeField === 'eventCountry') {
            this.eventCountry = place.address_components.find(component => component.types.includes('country'))?.long_name || '';
          } else if (this.activeField === 'eventCity') {
            this.eventCity = place.address_components.find(component => component.types.includes('locality'))?.long_name || '';
          } else if (this.activeField === 'eventAddress') {
            this.eventAddress = place.formatted_address;
          }
          this.addressSuggestions = [];
          this.showSuggestions = false;
        }
      });
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.showSuggestions && this.addressSuggestions.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.activeSuggestionIndex = (this.activeSuggestionIndex + 1) % this.addressSuggestions.length;
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.activeSuggestionIndex = (this.activeSuggestionIndex - 1 + this.addressSuggestions.length) % this.addressSuggestions.length;
          break;
        case 'Enter':
          if (this.activeSuggestionIndex >= 0 && this.activeSuggestionIndex < this.addressSuggestions.length) {
            this.selectSuggestion(this.addressSuggestions[this.activeSuggestionIndex]);
            event.preventDefault();
          }
          break;
        case 'Escape':
          this.showSuggestions = false;
          break;
      }
    }
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.suggestions')) {
      this.showSuggestions = false;
    }
  }
}
