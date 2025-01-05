import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Sighting } from '../shared/types/sighting.type';
import { Subscription } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import { SightingService } from '../shared/services/sighting.service';
import { ProgressSpinnerMode, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Timestamp } from 'firebase/firestore';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';     // Import MatInputModule
import { FormsModule } from '@angular/forms'; // Import FormsModule

// Interface for formatted sighting data
interface SightingFormatted extends Sighting {
  formattedDate: Date;
}

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'], // Use styleUrls for styles
})
export class ReportsComponent implements OnInit, OnDestroy {
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  loading: boolean = false;

  private sightingsSubscription: Subscription | undefined;
  dataSource = new MatTableDataSource<SightingFormatted>([]);
  displayedColumns: string[] = ['date', 'location', 'numbers', 'seaState', 'tide', 'behaviour', 'comments', 'observer'];
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private sightingService: SightingService,
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef // Inject ChangeDetectorRef
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

        // Update the data source with a new array instance
        this.dataSource.data = [...formattedSightings];

        // Set the paginator after data is assigned
        this.dataSource.paginator = this.paginator ?? null;

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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }
  }
}
