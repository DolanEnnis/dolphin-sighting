import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sighting } from '../shared/types/sighting.type';
import { Subscription } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import { SightingService } from '../shared/services/sighting.service';
import {MatProgressSpinnerModule, ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// Interface for formatted sighting data
interface SightingFormatted extends Sighting {
  formattedDate: Date;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
    MatCardModule,
    MatIconModule,
  ],
  providers: [],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  loading: boolean = false;

  private sightingsSubscription: Subscription | undefined;
  dataSource = new MatTableDataSource<SightingFormatted>([]);
  displayedColumns: string[] = ['date', 'location', 'numbers', 'seaState', 'tide', 'behaviour', 'comments', 'observer'];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  selectedSightingIndex: number = 0;
  isSingleView: boolean = false;
  filteredSightings: SightingFormatted[] = [];

  constructor(
    private sightingService: SightingService,
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isSingleView = result.matches;
      });
  }

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

        // Update the data source with a new array instance
        this.dataSource.data = [...formattedSightings];
        this.filteredSightings = [...formattedSightings]; // Initialize filteredSightings

        // Set the paginator after data is assigned
        this.dataSource.paginator = this.paginator ?? null;

        if (this.isSingleView) {
          this.selectSighting(0);
        }

        this.loadingService.setLoading(false);
        this.cdRef.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error fetching sightings:', error);
        this.loadingService.setLoading(false);
        // Handle error appropriately
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Update filteredSightings based on the dataSource filter
    this.filteredSightings = this.dataSource.filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // If in single view, ensure selectedSightingIndex is within bounds
    // and reset to 0 if no filter is applied
    if (this.isSingleView) {
      if (this.filteredSightings.length > 0) {
        if (this.selectedSightingIndex >= this.filteredSightings.length) {
          this.selectedSightingIndex = this.filteredSightings.length - 1;
        }
      } else {
        this.selectedSightingIndex = 0;
      }
    }
  }

  selectSighting(index: number) {
    this.selectedSightingIndex = index;
  }

  nextSighting() {
    if (this.selectedSightingIndex < this.filteredSightings.length - 1) {
      this.selectedSightingIndex++;
    }
  }

  previousSighting() {
    if (this.selectedSightingIndex > 0) {
      this.selectedSightingIndex--;
    }
  }

  ngOnDestroy(): void {
    if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }
  }
}
