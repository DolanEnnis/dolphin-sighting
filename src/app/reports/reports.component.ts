
import { Component,OnInit, OnDestroy  } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Observable } from 'rxjs';
import {Sighting} from '../shared/types/sighting.type';
import {Subscription} from 'rxjs';
import {LoadingService} from '../shared/services/loading.service';
import {SightingService} from '../shared/services/sighting.service';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-reports',
  imports: [CommonModule, MatProgressSpinnerModule],
  providers: [],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, OnDestroy{
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;
  sightings: Sighting[] = [];
  private sightingsSubscription: Subscription | undefined;
  loading: boolean = false

  constructor(private sightingService: SightingService,
              private loadingService: LoadingService,
             ) { }

  ngOnInit(): void {
    this.loadingService.setLoading(true)
    this.sightingsSubscription = this.sightingService. getAllSightings().subscribe({
      next: (sightings) => {
        this.sightings = sightings;
        this.loadingService.setLoading(false)
      },
      error: (error) => {
        console.error('Error fetching sightings:', error);
        this.loadingService.setLoading(false)
        // Handle error appropriately, e.g., display an error message to the user
      }
    });
  }


  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }
  }
}
/*
---------------------------------------------------------------------
import { Component,OnInit, OnDestroy  } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Observable } from 'rxjs';
import {Sighting} from '../shared/types/sighting.type';
import {Subscription} from 'rxjs';
import {LoadingService} from '../shared/services/loading.service';
import {SightingService} from '../shared/services/sighting.service';



@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit, OnDestroy{
  sightings$: Observable<Sighting[]> | undefined;


  loading: boolean = false

  constructor(
              private sightingService: SightingService,
              private loadingService: LoadingService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
 /* if (this.sightingsSubscription) {
      this.sightingsSubscription.unsubscribe();
    }
  }*/




