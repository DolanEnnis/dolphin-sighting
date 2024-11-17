import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sighting } from '../types/sighting.type';

@Injectable({
  providedIn: 'root'
})
export class SightingService {

  constructor() { }

  getSightings(): Observable<Sighting[]> {
    // We'll add the Firebase logic here later
    return new Observable<Sighting[]>();
  }
}
