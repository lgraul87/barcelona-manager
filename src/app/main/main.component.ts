import { Component } from '@angular/core';
import { Firestore, collection, query, collectionData } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { Player } from './player.dto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { doc, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  players: Player[] = [];
  playerFilteredForm!: FormGroup;
  addPlayerForm!: FormGroup;

  constructor(private firestore: Firestore, private modalService: NgbModal) { }

  async ngOnInit() {

    const playerCollection = query(collection(this.firestore, "player"));
    collectionData(playerCollection).subscribe(players => {
      this.players = players;
    });

    this.playerFilteredForm = new FormGroup({
      nameToFilter: new FormControl(''),
    });

    this.addPlayerForm = new FormGroup({
      name: new FormControl(''),
      number: new FormControl(''),
      position: new FormControl(''),
      age: new FormControl(''),
    });
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  filterPlayers(playerFilteredForm: any) {

    if (playerFilteredForm.value.nameToFilter.length > 0) {
      const playerCollection = query(collection(this.firestore, "player"));
      collectionData(playerCollection).subscribe(players => {
        this.players = players.filter(player => player['name']?.toLowerCase().includes(playerFilteredForm.value.nameToFilter.toLowerCase()));
      });

    } else {
      const playerCollection = query(collection(this.firestore, "player"));
      collectionData(playerCollection).subscribe(players => {
        this.players = players;
      });
    }
  }

  addPlayer(addPlayerForm:any) {
    const player = {
      name: addPlayerForm.value.name,
      number: addPlayerForm.value.number,
      position: addPlayerForm.value.position,
      age: addPlayerForm.value.age,
    };
    setDoc(doc(this.firestore, "player/" + player.number), player);
  }


}
