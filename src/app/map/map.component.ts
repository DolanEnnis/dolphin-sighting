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
// 'leaflet/dist/leaflet.css' is removed as per instructions above
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import { SightingService } from '../shared/services/sighting.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface Sighting {
  lat: number;
  long: number;
  date?: any;
  observer?: string;
  numbers?: string;
  [key: string]: any;
}

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
  // The 'sightingsSubscription' property is no longer needed
  allSightings: SightingFormatted[] = [];
  filteredSightings: SightingFormatted[] = [];
  uniqueYears: number[] = [];
  selectedYear: string | number = 'all';
  private sightingMarkers: L.Marker[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private sightingService: SightingService,
    private cdr: ChangeDetectorRef
  ) {
    const iconDefault = L.icon({
      iconUrl,
      iconRetinaUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = iconDefault;
  }

  ngOnInit(): void {
    this.loadSightings();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    // This is the correct way to use the destroy$ subject.
    // It will automatically unsubscribe from all streams using takeUntil.
    this.destroy$.next();
    this.destroy$.complete();

    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    if (this.map || !this.mapContainer) {
      return;
    }
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
    // No need to assign the subscription to a variable
    this.sightingService
      .getAllSightings({ sortField: 'date', sortDirection: 'asc' })
      .pipe(takeUntil(this.destroy$))
      .subscribe((sightings) => {
        this.allSightings = sightings;
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
      if (sighting.formattedDate) {
        years.add(sighting.formattedDate.getFullYear());
      }
    });
    this.uniqueYears = Array.from(years).sort((a, b) => b - a); // Sort descending for recent years first
  }

  filterByYear(): void {
    this.filterSightings();
    this.updateMarkers();
  }

  private filterSightings(): void {
    if (this.selectedYear === 'all') {
      this.filteredSightings = [...this.allSightings];
    } else if (typeof this.selectedYear === 'number') {
      this.filteredSightings = this.allSightings.filter(
        (sighting) =>
          sighting.formattedDate &&
          sighting.formattedDate.getFullYear() === this.selectedYear
      );
    }
  }

  private updateMarkers(): void {
    this.sightingMarkers.forEach((marker) => this.map?.removeLayer(marker));
    this.sightingMarkers = [];

    this.filteredSightings.forEach((sighting) => {
      const lat = sighting.lat;
      // Note: Negating longitude is specific to your data source.
      // This is correct if your source stores western longitudes as positive numbers.
      const long = -sighting.long;

      if (this.isValidCoordinate(lat, long)) {
        const marker = L.marker([lat, long]);
        const popupContent = this.createPopupContent(sighting);
        marker.bindPopup(popupContent);
        marker.addTo(this.map!);
        this.sightingMarkers.push(marker);
      }
    });
  }

  // Extracted logic into helper methods for better readability
  private isValidCoordinate(lat: number, long: number): boolean {
    return (
      !isNaN(lat) &&
      lat >= 52.5 &&
      lat <= 52.7 &&
      !isNaN(long) &&
      long <= -8.5 &&
      long >= -10
    );
  }

  private createPopupContent(sighting: SightingFormatted): string {
    let content = '';
    if (sighting.formattedDate) {
      const formattedDate = sighting.formattedDate.toLocaleString('en-IE', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
      content += `<b>Date:</b> ${formattedDate}<br>`;
    } else {
      content += '<b>Date:</b> Not available<br>';
    }

    if (sighting.observer) {
      content += `<b>Observer:</b> ${sighting.observer}<br>`;
    }

    if (sighting.numbers) {
      content += `<b>Group Size:</b> ${sighting.numbers}<br>`;
    }

    return content;
  }
}
