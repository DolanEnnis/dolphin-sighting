import {Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SightingFormatted } from '../shared/types/sighting.type';
import { Subscription } from 'rxjs';
import { LoadingService } from '../shared/services/loading.service';
import { SightingService } from '../shared/services/sighting.service';
import { AuthService } from '../shared/services/auth.service';
//import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {MatIconButton} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';





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
    //MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatIconButton,
    MatTooltipModule,
  ],
  providers: [],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  // Configuration for the progress spinner.
 //essSpinnerMode = 'determinate';
  value = 50; // Initial value (not used in 'determinate' mode)
 // loading: boolean = false; // Flag to indicate data loading state
  authService = inject(AuthService);
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
    'actions',
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
    this.loadSightings();
  }

  /**
   * Fetches and loads sighting data.
   * This method retrieves data from the sighting service, formats it,
   * and updates the component's state.
   */
  private loadSightings(): void {
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
   * Checks if the current user can delete a sighting.
   * Users can only delete their own sightings or anonymous sightings.
   *
   * @param sighting - The sighting to check delete permissions for
   * @returns true if the user can delete the sighting, false otherwise
   */
  canDeleteSighting(sighting: SightingFormatted): boolean {
    const currentUser = this.authService.getCurrentUser();
    const currentUserName = currentUser?.displayName;

    // Allow deletion if:
    // 1. The sighting observer matches the current user's displayName
    // 2. The sighting observer is "Anonymous"
    return sighting.observer === currentUserName || sighting.observer === 'Anonymous';
  }

  /**
   * Deletes a sighting record.
   * Calls the sighting service to delete the record and refreshes the data.
   *
   * @param sighting - The sighting record to delete
   */
  deleteSighting(sighting: SightingFormatted): void {
    // Check if sighting has a valid ID
    if (!sighting.id) {
      console.error('Cannot delete sighting: ID is missing');
      alert('Cannot delete sighting: Invalid record.');
      return;
    }

    // Optional: Add confirmation dialog
    if (!confirm(`Are you sure you want to delete this sighting from ${sighting.location} on ${sighting.formattedDate.toDateString()}?`)) {
      return;
    }

    console.log('Deleting sighting:', sighting.id);

    // Call the sighting service to delete the record (using Promise syntax)
    this.sightingService.delete(sighting.id)
      .then(() => {
        console.log('Sighting deleted successfully');

        // Refresh the data after successful deletion
        this.loadSightings();

        // If we're in single view and deleted the current item, adjust the selection
        if (this.isSingleView && this.filteredSightings.length > 0) {
          // If we deleted the last item, go to the previous one
          if (this.selectedSightingIndex >= this.filteredSightings.length) {
            this.selectedSightingIndex = Math.max(0, this.filteredSightings.length - 1);
          }
        }
      })
      .catch((error) => {
        console.error('Error deleting sighting:', error);
        // Optional: Show user-friendly error message
        alert('Failed to delete sighting. Please try again.');
      });
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
