import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SightingService } from '../shared/services/sighting.service';
import { takeUntil } from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';


interface Sighting {
  lat: number;
  long: number;
  date?: any; // Adjust type as needed based on your Firebase data
  observer?: string;
  numbers?: string;
  [key: string]: any; // Add index signature
}

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
export class MapComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map: L.Map | undefined;
  private readonly centerCoordinates: L.LatLngExpression = [52.6, -9.5];
  private readonly zoomLevel = 12;
  private sightingsSubscription: Subscription | undefined;
  allSightings: SightingFormatted[] = []; // Changed to SightingFormatted
  filteredSightings: SightingFormatted[] = [];
  uniqueYears: number[] = [];
  selectedYear: string | number = 'all';
  private sightingMarkers: L.Marker[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private sightingService: SightingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSightings();

  }

  ngAfterViewInit(): void {
    this.initMap();

  }

  ngOnDestroy(): void {
    if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }

    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView(
      this.centerCoordinates,
      this.zoomLevel
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  loadSightings(): void {
    this.sightingsSubscription = this.sightingService
      .getAllSightings({ sortField: 'date', sortDirection: 'asc' })
      .pipe(takeUntil(this.destroy$))
      .subscribe((sightings) => {
        this.allSightings = sightings; // Data is already SightingFormatted
        this.extractUniqueYears();
        this.selectedYear = this.uniqueYears.includes(new Date().getFullYear())
          ? new Date().getFullYear()
          : 'all';
        this.filterSightings();
        this.updateMarkers();
        this.cdr.detectChanges();
      });
  }

  private extractUniqueYears(): void {
    const years = new Set<number>();
    this.allSightings.forEach((sighting) => {
      if (sighting.formattedDate) { // Use formattedDate here
        years.add(sighting.formattedDate.getFullYear());
      }
    });
    this.uniqueYears = Array.from(years).sort();
  }

  filterByYear(): void {
    this.filterSightings();
    this.updateMarkers();
  }

  private filterSightings(): void {
    if (this.selectedYear === 'all') {
      this.filteredSightings = [...this.allSightings]; // Use formattedDate here
    } else if (typeof this.selectedYear === 'number') {

      this.filteredSightings = this.allSightings.filter((sighting) => {
        return sighting.formattedDate && sighting.formattedDate.getFullYear() === this.selectedYear; // Use formattedDate here
      });
    }
  }

  private updateMarkers(): void {
    // Clear existing markers
    this.sightingMarkers.forEach((marker) => this.map?.removeLayer(marker));
    this.sightingMarkers = [];

    this.filteredSightings.forEach((sighting) => {
      const lat = sighting.lat;
      const long = -sighting.long;// Negate longitude here

      if (

        !isNaN(lat) &&
        lat >= 52.5 &&
        lat <= 52.7 &&

        !isNaN(long) &&
        long <= -8.5 &&
        long >= -10
      ) {
        const marker = L.marker([lat, long]);
        let popupContent = '';
        if (sighting.formattedDate) {
          const formattedDate = sighting.formattedDate.toLocaleString('en-IE', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          });
          popupContent += `Date: ${formattedDate}<br>`;
        } else {
          popupContent += 'Date: Not available<br>';
        }

        if (sighting.observer) {
          popupContent += `Observer: ${sighting.observer}<br>`;
        }

        if (sighting.numbers) {
          popupContent += `Group Size: ${sighting.numbers}<br>`;
        }

        marker.bindPopup(popupContent);
        marker.addTo(this.map!);
        this.sightingMarkers.push(marker);
      }
    });
  }


}
