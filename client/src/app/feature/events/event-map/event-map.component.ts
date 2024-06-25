import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { IEvent } from '../../../core/interfaces';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.css']
})
export class EventMapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() events: IEvent[];
  private map: L.Map;
  private markersLayer: L.LayerGroup;

  ngOnInit(): void {
    console.log('!!!!!!!!ngOnInit: events', this.events);
    this.markersLayer = new L.LayerGroup();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('!!!!!!!!!!!!!!!ngOnChanges: events', changes.events);
    if (changes.events && this.map) {
      this.updateMarkers();
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  private updateMarkers(): void {
    this.markersLayer.clearLayers();

    this.events.forEach(event => {
      const addressParts = [];
      if (event.eventAddress) addressParts.push(event.eventAddress);
      if (event.eventCity) addressParts.push(event.eventCity);
      if (event.eventCountry) addressParts.push(event.eventCountry);
      const fullAddress = addressParts.join(', ');

      console.log(`!!!!!!!!!!!!Full address: ${fullAddress}`);

      if (fullAddress) {
        this.geocodeAddress(fullAddress).then((coords) => {
          if (coords) {
            const marker = L.marker([coords.lat, coords.lng]);
            marker.bindPopup(`<b>${event.eventName}</b><br>${fullAddress}`);
            this.markersLayer.addLayer(marker);
          }
        });
      }
    });
  }

  private geocodeAddress(address: string): Promise<{ lat: number, lng: number }> {
    return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const firstResult = data[0];
          return {
            lat: parseFloat(firstResult.lat),
            lng: parseFloat(firstResult.lon)
          };
        } else {
          return null;
        }
      });
  }
}
