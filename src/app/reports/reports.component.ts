import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sighting } from '../shared/types/sighting.type';
import { Subscription } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import { SightingService } from '../shared/services/sighting.service';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

/**
 * Interface for sighting data with formatted date.
 * Extends the base Sighting interface to include a Date object.
 */
interface SightingFormatted extends Sighting {
  formattedDate: Date;
}

/**
 * Component for displaying reports of dolphin sightings.
 *
 * This component fetches sighting data, formats it for display, and
 * provides filtering and pagination functionality. It also adapts
 * the layout for different screen sizes.
 */
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
  // Configuration for the progress spinner.
  mode: ProgressSpinnerMode = 'determinate';
  value = 50; // Initial value (not used in 'determinate' mode)
  loading: boolean = false; // Flag to indicate data loading state

  private sightingsSubscription: Subscription | undefined; // Subscription for sighting data observable
  dataSource = new MatTableDataSource<SightingFormatted>([]); // Data source for the MatTable
  displayedColumns: string[] = [
    'date',
    'location',
    'numbers',
    'seaState',
    'tide',
    'behaviour',
    'comments',
    'observer',
  ]; // Columns to display in the table

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined; // Reference to the MatPaginator instance

  selectedSightingIndex: number = 0; // Index of the currently selected sighting (for single view)
  isSingleView: boolean = false; // Flag to indicate if the component is in single-column (mobile) view
  filteredSightings: SightingFormatted[] = []; // Array to store sightings after filtering

  /**
   * Constructor for ReportsComponent.
   *
   * @param sightingService - Service for fetching sighting data.
   * @param loadingService - Service for managing loading state.
   * @param cdRef - ChangeDetectorRef for manual change detection.
   * @param breakpointObserver - Service for detecting screen size changes.
   */
  constructor(
    private sightingService: SightingService,
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    // Observe screen size changes and set 'isSingleView' accordingly.
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isSingleView = result.matches;
    });
  }

  /**
   * Lifecycle hook called once the component has been initialized.
   *
   * Fetches sighting data, formats it, and sets up the table data source
   * and pagination.
   */
  ngOnInit(): void {
    this.loadingService.setLoading(true); // Show loading indicator
    this.sightingsSubscription = this.sightingService
      .getAllSightings({ sortField: 'date', sortDirection: 'desc' }) // Fetch sightings, sorted by date descending
      .subscribe({
        next: (sightings) => {
          // Format the sighting data using the service method
          const formattedSightings: SightingFormatted[] = sightings.map((sighting) =>
            this.sightingService.convertToSightingFormatted(sighting)
          );

          // Update the data source with a new array instance
          this.dataSource.data = [...formattedSightings];
          this.filteredSightings = [...formattedSightings]; // Initialize filteredSightings

          // Set the paginator after data is assigned
          this.dataSource.paginator = this.paginator ?? null;

          // If in single view, select the first sighting
          if (this.isSingleView) {
            this.selectSighting(0);
          }

          this.loadingService.setLoading(false); // Hide loading indicator
          this.cdRef.detectChanges(); // Trigger change detection
        },
        error: (error) => {
          console.error('Error fetching sightings:', error);
          this.loadingService.setLoading(false); // Hide loading indicator
          // Handle error appropriately (e.g., show error message)
        },
      });
  }

  /**
   * Applies a filter to the data source.
   *
   * @param event - Event object from the filter input.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Apply filter

    // Update filteredSightings based on the dataSource filter
    this.filteredSightings = this.dataSource.filteredData;

    // Reset pagination to the first page if it exists.
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

  /**
   * Selects a sighting in the single-view display.
   *
   * @param index - Index of the sighting to select.
   */
  selectSighting(index: number) {
    this.selectedSightingIndex = index;
  }

  /**
   * Selects the next sighting in the single-view display.
   */
  nextSighting() {
    if (this.selectedSightingIndex < this.filteredSightings.length - 1) {
      this.selectedSightingIndex++;
    }
  }

  /**
   * Selects the previous sighting in the single-view display.
   */
  previousSighting() {
    if (this.selectedSightingIndex > 0) {
      this.selectedSightingIndex--;
    }
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   *
   * Unsubscribes from any active subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }
  }
}
