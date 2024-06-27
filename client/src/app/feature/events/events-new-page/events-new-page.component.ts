/// <reference types="@types/google.maps" />

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { NgZone } from '@angular/core'; // Import NgZone
import { EventService } from 'src/app/core/event.service';
import { IEvent, IPost } from 'src/app/core/interfaces';

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

  constructor(
    private router: Router,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
  ) { } 
    

  ngOnInit(): void {
    // get url params and check page
    this.activatedRoute.params.subscribe(params => {
      this.eventId = params['eventId'];
      this.isEditPage = !!this.eventId;

      if (this.isEditPage) {
        console.log("isEditPage ", this.isEditPage);
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
          return this.eventService.loadEventById(eventId)
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

        console.log("event ", this.event);
      })
  }

  createEvent(newEventForm: any) {
    console.log("newEventForm.value");
    console.log(newEventForm.value);
    this.eventService.addEvent$(newEventForm.value).subscribe({
      next: (event) => {
        console.log(event);
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  updateEvent(eventId: string, newEventForm: any) {
    console.log("newEventForm.value");
    console.log(newEventForm.value);
    const eventName = newEventForm.value.eventName;
    console.log("uodate for is edited");
    this.eventService.editEvent(eventId, newEventForm.value).subscribe({
      next: (event) => {
        console.log(newEventForm.value);
        this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  // Method to get address suggestions
  getSuggestions(query: string) {
    if (query.length > 2) {
      this.eventService.getPlacePredictions(query).subscribe(suggestions => {
        this.addressSuggestions = suggestions;
      });
    } else {
      this.addressSuggestions = [];
    }
  }

  selectSuggestion(suggestion: any) {
    const placeService = new google.maps.places.PlacesService(document.createElement('div'));
    placeService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
      this.ngZone.run(() => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.eventCountry = place.address_components.find(component => component.types.includes('country'))?.long_name || '';
          this.eventCity = place.address_components.find(component => component.types.includes('locality'))?.long_name || '';
          this.eventAddress = place.formatted_address;
          this.addressSuggestions = [];
        }
      });
    });
  }
}
