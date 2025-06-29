import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgForOf,  } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import flatpickr from 'flatpickr';
import { AuthService } from '../shared/services/auth.service';
import { SightingService } from '../shared/services/sighting.service';
//import { Sighting } from '../shared/types/sighting.type';
import { UIService } from '../shared/services/ui.service';

@Component({
  selector: 'app-sighting-form',
  standalone: true,
  providers: [UIService],
  imports: [
    ReactiveFormsModule,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,

  ],
  templateUrl: './sighting-form.component.html',
  styleUrl: './sighting-form.component.css'
})
export class SightingFormComponent implements OnInit, AfterViewInit {
  sightingForm!: FormGroup;
  isSubmitting = false;
  authService = inject(AuthService);
  public now = new Date();
  //public max = (this.now.getDate()+1)
  //public min = new Date(2024,2, 4, 4, 44);
  private buoy: string = '';

  locations: {value: string, viewValue: string}[] = [
    {value: 'Ballybunnion', viewValue: 'Ballybunnion'},
    {value: 'Kilstiffin', viewValue: 'Kilstiffin'},
    {value: 'Tail of Beal', viewValue: 'Tail of Beal'},
    {value: 'Beal Spit', viewValue: 'Beal Spit'},
    {value: 'Beal Bar', viewValue: 'Beal Bar'},
    {value: 'Letter Point', viewValue: 'Letter Point'},
    {value: 'Asdee', viewValue: 'Asdee'},
    {value: 'Rineanna', viewValue: 'Rineanna'},
    {value: 'North Carrig', viewValue: 'North Carrig'},
    {value: 'Moneypoint', viewValue: 'Moneypoint'},
    {value: 'Kilkerrin', viewValue: 'Kilkerrin'},
    {value: 'Bolands', viewValue: 'Bolands'},
    {value: 'Long Rock', viewValue: 'Long Rock'},
    {value: 'Loghill', viewValue: 'Loghill'},
    {value: 'Foynes', viewValue: 'Foynes'},
    {value: 'Up Stream of Foynes', viewValue: 'Up Stream of Foynes'}
  ];
  seaStates: {value: string, viewValue: string}[] = [
    {value: '0', viewValue: '0 - Calm (glassy)'},
    {value: '1', viewValue: '1 - Calm (rippled)'},
    {value: '2', viewValue: '2 - Smooth (wavelets)'},
    {value: '3', viewValue: '3 - Slight (0.5 to 1.25 m) '},
    {value: '4', viewValue: '4 - Moderate (1.25 to 2.5 m)'},
    {value: '5', viewValue: '5 - Rough (2.5 to 4 m)'},
  ]

  tides: {value: string, viewValue: string}[] = [
    {value: 'HW -6', viewValue: 'HW -6 Flood'},
    {value: 'HW -5', viewValue: 'HW -5 Flood'},
    {value: 'HW -4', viewValue: 'HW -4 Flood'},
    {value: 'HW -3', viewValue: 'HW -3 Flood'},
    {value: 'HW -2', viewValue: 'HW -2 Flood'},
    {value: 'HW -1', viewValue: 'HW -1 Flood'},
    {value: 'HW', viewValue: 'HW'},
    {value: 'HW +1', viewValue: 'HW +1 Ebb'},
    {value: 'HW +2', viewValue: 'HW +2 Ebb'},
    {value: 'HW +3', viewValue: 'HW +3 Ebb'},
    {value: 'HW +4', viewValue: 'HW +4 Ebb'},
    {value: 'HW +5', viewValue: 'HW +5 Ebb'},
    {value: 'HW +6', viewValue: 'HW +6 Ebb'},
  ]
  behaviours: {value: string, viewValue: string}[]=   [
    {value: 'Foraging', viewValue:  'Foraging (searching for prey,feeding behaviours ie surface rushing)'},
    {value: 'Rest', viewValue:      'Rest(Slow, steady activity, often with long dive bouts, 1 to 5 min)'},
    {value: 'Travel Up River', viewValue: 'Travel Up River'},
    {value: 'Travel Down River', viewValue: 'Travel Down River'},
    {value: 'With boat', viewValue: 'With boat (including bow- and wake-riding)'},
    {value: 'Play', viewValue:      'Play (Interactions with objects other than dolphins which serve no obvious purpose )'},
    {value: 'See Note', viewValue: 'Other (See Note)'},
  ]

  @ViewChild('dateInput') dateInput!: ElementRef;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sightingService: SightingService,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
    this.sightingForm = this.fb.group({
      date: [flatpickr.formatDate(new Date(), "D d-m-Y H:i"), [Validators.required]],
      latitude: ['', [Validators.min(52), Validators.max(52.7)]],
      latmin:['',[Validators.min(25), Validators.max(59)]],
      longitude: ['', [Validators.min(-180), Validators.max(180)]],
      longmin:[''],
      location: ['',[Validators.required]],
      dolphinCount: ['', [Validators.required, Validators.min(1)]],
      seaState: [''],
      tide: [''],
      behaviour: [''],
      comments: [''],
    });

    this.hereandnow();
  }

  private readonly FLATPICKR_CONFIG = {
    defaultDate: new Date(),
    dateFormat: "D d-m-Y H:i",
    enableTime: true,
    maxDate: "today",
    time_24hr: true
  };

  ngAfterViewInit() {
    flatpickr(this.dateInput.nativeElement, this.FLATPICKR_CONFIG);
  }

  hereandnow() {
    this.now = new Date();
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.sightingForm.patchValue({
            'date': flatpickr.formatDate(this.now, "D d-m-Y H:i"),
            'latitude': Math.floor(position.coords.latitude),
            'latmin': ((position.coords.latitude - Math.floor(position.coords.latitude)) * 60).toFixed(3),
            'longitude': Math.floor(position.coords.longitude * -1),
            'longmin': (((position.coords.longitude * -1) - Math.floor(position.coords.longitude * -1)) * 60).toFixed(3),
            'location': this.getBuoy(position.coords.longitude * -1),
          });
        },
        error => {
          // Handle error
          console.error(error);
          this.uiService.showSnackbar('Could not get location, please enter manually.', 'error');
        }
      );
    }
  }


  getBuoy(longitude: number): string {
    if (longitude > 10 || longitude < 8.6) {
      this.uiService.showSnackbar("This Position is not on the River!!", "");
    } else if (longitude > 9.7836) {
      this.buoy = 'Ballybunnion';
    } else if (longitude > 9.7317) {
      this.buoy = 'Kilstiffin';
    } else if (longitude > 9.679546) {
      this.buoy = 'Tail of Beal';
    } else if (longitude > 9.67899) {
      this.buoy = 'Beal Spit';
    } else if (longitude > 9.65087) {
      this.buoy = 'Beal Bar';
    } else if (longitude > 9.5978333) {
      this.buoy = 'Letter Point';
    } else if (longitude > 9.57567) {
      this.buoy = 'Asdee';
    } else if (longitude > 9.5183) {
      this.buoy = 'Rineanna';
    } else if (longitude > 9.496) {
      this.buoy = 'North Carrig';
    } else if (longitude > 9.4196005) {
      this.buoy = 'Moneypoint';
    } else if (longitude > 9.3525) {
      this.buoy = 'Kilkerrin';
    } else if (longitude > 9.3272) {
      this.buoy = 'Bolands';
    } else if (longitude > 9.2675) {
      this.buoy = 'Long Rock';
    } else if (longitude > 9.214) {
      this.buoy = 'Loghill';
    } else if (longitude > 9.13) {
      this.buoy = 'Foynes';
    } else {
      this.buoy = 'Up Stream of Foynes';
    }
    return this.buoy;
  }

  async onSubmit() {
    if (this.sightingForm.invalid) {
      return;
    }
    if (this.sightingForm.valid) {
      this.isSubmitting = true;
      const currentUser = this.authService.getCurrentUser();

      console.log('Form submitted:', this.sightingForm.value);
      const rawFormValue = this.sightingForm.value;
      const tidiedData  = {
        date: typeof rawFormValue.date === 'string'
          ? flatpickr.parseDate(rawFormValue.date, "d-m-Y H:i")
          : rawFormValue.date,
        lat: Number(rawFormValue.latitude) + Number(rawFormValue.latmin/60),
        long: Number(rawFormValue.longitude) + Number(rawFormValue.longmin/60),
        location: rawFormValue.location,
        numbers: rawFormValue.dolphinCount,
        seaState: rawFormValue.seaState,
        tide: rawFormValue.tide,
        behaviour: rawFormValue.behaviour,
        comments: rawFormValue.comments,
        observer: currentUser?.displayName || 'Anonymous', // Corrected line
        observerID: currentUser ? currentUser.uid : 'Anonymous',
      }
      console.log('Tidied submitted:', tidiedData);

      try {
        await this.sightingService.create(tidiedData);
        this.uiService.showSnackbar('Sighting successfully created!', 'success');
        this.router.navigate(['/reports']);
      } catch (error) {
        console.error('Error creating sighting:', error);
        this.uiService.showSnackbar('Error creating sighting, please try again.', 'error');
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  resetForm() {
    this.sightingForm.reset();
    this.hereandnow();
  };}
