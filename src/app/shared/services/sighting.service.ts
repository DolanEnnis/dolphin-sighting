import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sighting } from '../types/sighting.type';
import { Firestore, collection, collectionData, doc, docData, setDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root' // Important: Keep this
})
export class SightingService {
  private firestore: Firestore = inject(Firestore); // Inject Firestore

  constructor() { }

  getAllSightings(): Observable<Sighting[]> {
    const sightingsCollection = collection(this.firestore, 'sightings');
    return collectionData(sightingsCollection, { idField: 'id' }) as Observable<Sighting[]>;
  }
  getItem(id: string): Observable<Sighting> {
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return docData(sightingDoc) as Observable<Sighting>;
  }
  create(sighting: Sighting): Promise<void>{
    const sightingsCollection = collection(this.firestore, 'sightings');
    return setDoc(doc(sightingsCollection), sighting);
  }
  update(sighting: Sighting, id: string): Promise<void>{
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return setDoc(sightingDoc, sighting);
  }
  delete(id: string): Promise<void>{
    const sightingDoc = doc(this.firestore, `sightings/${id}`);
    return deleteDoc(sightingDoc)
  }
}
