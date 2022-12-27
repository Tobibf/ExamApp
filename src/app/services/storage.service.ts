import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private Storage: Storage) { }
}
