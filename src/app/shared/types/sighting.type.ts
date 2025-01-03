
import firebase from 'firebase/compat/app'; // Or import from 'firebase/app' and other specific modules
//import 'firebase/compat/firestore'; // Import for firestore
//import not needed as using date: any;


export interface Sighting {
  behaviour: string;
  comments?: string;
  date: any;  //as date can change between firestore timestamp and javascript date
  id?: string;
  lat: number;            // 52.57958333333333
  location: string;       // "Long Rock"
  long: number;           // 9.318216666666666
  numbers: string;        // "6"
  observer: string;       // "Brian"
  observerID: string;     // "yeNcVSx6AGNi2IiKWD3tlYI08T13"
  seaState: string;       // "2"
  tide: string;           // "HW -3"
}

