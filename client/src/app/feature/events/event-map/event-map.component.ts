import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IEvent } from '../../../core/interfaces';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.css']
})
export class EventMapComponent implements OnInit {
  @Input() events: IEvent[];
  mapUrls: SafeResourceUrl[];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.mapUrls = this.events.map(event => {
      const fullAddress = `${event.eventAddress}, ${event.eventCity}, ${event.eventCountry}`;
      const encodedAddress = encodeURIComponent(fullAddress);
      const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodedAddress}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    });
  }
}
