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
    L.Icon.Default.imagePath = '/assets/';
    console.log('ngOnInit: events', this.events);
    this.markersLayer = new L.LayerGroup();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.updateMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: events', changes.events);
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
// TODO PAY - with Google API key
  private updateMarkers(): void {
    this.markersLayer.clearLayers();
  
    const geocodePromises = this.events.map(event => {
      let addressParts = [];
      if (event.eventAddress) addressParts.push(event.eventAddress);
      if (event.eventCity) addressParts.push(event.eventCity);
      if (event.eventCountry) addressParts.push(event.eventCountry);
      const fullAddress = addressParts.join(', ');
  
      console.log(`Full address: ${fullAddress}`);
      console.log(addressParts);
  
      if (fullAddress) {
        return this.geocodeAddress(fullAddress).then(coordsArray => {
          if (coordsArray.length > 0) {
            // Using the first valid coordinates found
            const coords = coordsArray[0];
            const marker = L.marker([coords.lat, coords.lng]);
            marker.bindPopup(`<b>${event.eventName}</b><br>${fullAddress}`);
            this.markersLayer.addLayer(marker);
          } else {
            console.warn(`No valid coordinates found for address '${fullAddress}'`);
          }
        }).catch(error => {
          console.error(`Error geocoding address '${fullAddress}':`, error);
        });
      } else {
        console.warn(`Event does not have valid address data:`, event);
        return Promise.resolve(); // Resolve immediately if no valid address data
      }
    });
  
    Promise.all(geocodePromises).then(() => {
      if (this.markersLayer.getLayers().length > 0) {
        const group = L.featureGroup(this.markersLayer.getLayers());
        this.map.fitBounds(group.getBounds());
      }
    }).catch(error => {
      console.error('Error adding markers:', error);
    });
  }
  // TODO PAY - with Google API key
  private geocodeAddress(address: string): Promise<{ lat: number, lng: number }[]> {
    return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          console.warn(`Geocoding results for '${address}':`, data);
          return data.map(result => ({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          }));
        } else {
          console.warn(`No results found for address '${address}'`);
          return [];
        }
      })
      .catch(error => {
        console.error(`Error fetching or parsing geocoding response for address '${address}':`, error);
        return [];
      });
  }
  
  
}
