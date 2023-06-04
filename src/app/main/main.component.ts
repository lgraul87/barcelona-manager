import { Component } from '@angular/core';
import { Firestore, collection, getDocs, where, query, QueryDocumentSnapshot, DocumentData, collectionData } from '@angular/fire/firestore';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Player } from './player.dto';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  players: Player[] = [];

  constructor(private firestore: Firestore) { }

  async ngOnInit() {

    const playerCollection = query(collection(this.firestore, "player"));
    collectionData(playerCollection).subscribe(players => {
      this.players = players;
    });
  }

}
