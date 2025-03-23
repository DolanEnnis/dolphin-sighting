  import {Component,  OnDestroy,  AfterViewInit, ElementRef, ViewChild ,ChangeDetectionStrategy,  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Sighting } from '../shared/types/sighting.type';
  import { Subscription } from 'rxjs';
  import { SightingService } from '../shared/services/sighting.service';
  import { MatCardModule } from '@angular/material/card';
  import { MatRadioModule } from '@angular/material/radio';
  import { FormsModule } from '@angular/forms';
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
  import { Timestamp } from 'firebase/firestore';


  // Define the SightingFormatted interface
  interface SightingFormatted extends Sighting {
    formattedDate: Date;
  }

  @Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatRadioModule, FormsModule],
    templateUrl: './map.component.html',
    styleUrl: './map.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class MapComponent implements AfterViewInit,  OnDestroy {
    @ViewChild('mapContainer') mapContainer!: ElementRef;
    private sightingsSubscription: Subscription | undefined;
    private map: L.Map | undefined;
    private readonly centerCoordinates: L.LatLngExpression = [52.6, -9.5];

    private readonly zoomLevel = 12;
    constructor(private sightingService: SightingService,) {}

    ngAfterViewInit(): void {
      this.initMap();
      this.loadSightings();

    }

    private initMap(): void {

      this.map = L.map(this.mapContainer.nativeElement).setView(this.centerCoordinates, this.zoomLevel);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);


    }

    loadSightings(): void {
      this.sightingsSubscription = this.sightingService.getAllSightings({ sortField: 'date', sortDirection: 'asc' }).subscribe({
        next: (sightings) => {
          const formattedSightings: SightingFormatted[] = sightings.map(
            (sighting) => {
              let date: Date;
              if (sighting.date instanceof Timestamp) {
                date = sighting.date.toDate(); // Convert Timestamp to Date
              } else if (typeof sighting.date === 'string') {
                date = new Date(sighting.date); // Handle string dates
              } else if (sighting.date instanceof Date) {
                date = sighting.date;
              } else {
                date = new Date(); // Provide default date
              }
              return { ...sighting, formattedDate: date };
            });

          // Add markers to the map for each sighting
          this.addFilteredSightingsToMap(formattedSightings);
        }
      });
    }




    private addFilteredSightingsToMap(sightings: SightingFormatted[]): void {
      if (this.map) {
        sightings.forEach(sighting => {
          const lat = sighting.lat;
          const long = -sighting.long;
          if (

            !isNaN(lat) &&
            lat >= 52.5 &&
            lat <= 52.7 &&

            !isNaN(long) &&
            long <= -8.5 &&
            long >= -10
          ) {
            const marker = L.marker([lat, long]).addTo(this.map!);
            let popupContent = '';
            if (sighting.date && sighting.date.toDate) {
              const date = sighting.date.toDate();
              const formattedDate = date.toLocaleString('en-IE', { // Use 'en-IE' for Irish English locale
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              });
              popupContent += `Date: ${formattedDate}<br>`;
            } else {
              popupContent += 'Date: Not available<br>';
            }

            if (sighting.numbers) {
              popupContent += `Group Size: ${sighting.numbers}<br>`;
            }
            if (sighting.observer) {
              popupContent += `Observer: ${sighting.observer}<br>`;
            }



            marker.bindPopup(popupContent);
          }
        });
      }
    }



    ngOnDestroy(): void {
      if (this.sightingsSubscription) {
        this.sightingsSubscription.unsubscribe();
      }

      if (this.map) {
        this.map.remove();
      }
    }
  }
