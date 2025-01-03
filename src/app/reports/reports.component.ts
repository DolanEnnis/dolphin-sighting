import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { Sighting } from '../shared/types/sighting.type';
import { Subscription } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import { SightingService } from '../shared/services/sighting.service';
import {
  ProgressSpinnerMode,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Timestamp } from 'firebase/firestore';
//

interface SightingFormatted extends Sighting {
  formattedDate: Date;
}

@Component({
  selector: 'app-reports',

  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,

     // Make sure this is here
    DatePipe // If you're using the date pipe
  ],
  providers: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})

export class ReportsComponent implements OnInit,  OnDestroy {
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  loading: boolean = false; // Use boolean for loading state

  private sightingsSubscription: Subscription | undefined;
  dataSource = new MatTableDataSource<SightingFormatted>([]);
  displayedColumns: string[] = ['location', 'date', 'observer'];


  constructor(
    private sightingService: SightingService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.sightingsSubscription = this.sightingService.getAllSightings('date').subscribe({
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
          }
        );
        this.dataSource.data = formattedSightings;

        this.loadingService.setLoading(false);
      },
      error: (error) => {
        console.error('Error fetching sightings:', error);
        this.loadingService.setLoading(false);
        // Handle error appropriately
      },
    });
  }



  ngOnDestroy(): void {
    if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }
  }
}
