import { Injectable } from '@angular/core';
import { Firestore, collection, query, collectionData } from '@angular/fire/firestore';
import { DocumentData, Query, doc, setDoc } from 'firebase/firestore';
import { Player } from '../interfaces/player.dto';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private firestore: Firestore) { }

  getCollections() {
    return query(collection(this.firestore, "player"));
  }

  addPlayer(player: Player) {
    setDoc(doc(this.firestore, "player/" + player.number), player);
  }
}
