import { Component } from '@angular/core';
import { Firestore, collection, query, collectionData } from '@angular/fire/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentData, Query, doc, setDoc } from 'firebase/firestore';
import { Player } from '../interfaces/player.dto';
import { MainService } from '../services/main.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  players: Player[] = [];
  playerFilteredForm!: FormGroup;
  addPlayerForm!: FormGroup;
  barcelonaIcon = 'assets/icono-escudo.jpg';
  barcelonaCard = 'assets/escudo.jpg';
  fileToUpload: any = null;

  constructor(
    private modalService: NgbModal,
    private mainService: MainService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!sessionStorage.getItem('userLogged')) {
      this.router.navigate(['']);
    }
    this.findAllPlayers();
    this.initPlayerFilteredForm();
    this.initAddPlayerForm();
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  filterPlayers(playerFilteredForm: FormGroup) {
    if (playerFilteredForm.value.nameToFilter.length > 0) {
      const playerCollection = this.mainService.getCollections();
      this.filterPlayerByName(playerCollection, playerFilteredForm);
    } else {
      const playerCollection = this.mainService.getCollections();
      this.setPlayerList(playerCollection);
    }
  }

  addPlayer(addPlayerForm: FormGroup) {
    const file = this.fileToUpload;
    const storage = getStorage();
    const storageRef = ref(storage, '/players/' + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(ref(storage, '/players/' + file.name))
        .then((url) => {
          const player = {
            name: addPlayerForm.value.name,
            number: addPlayerForm.value.number,
            position: addPlayerForm.value.position,
            age: addPlayerForm.value.age,
            url: url
          };
          this.mainService.addPlayer(player);
        }).catch((error) => {
          console.log("Un error: ", error);
        });
    });
  }

  private findAllPlayers() {
    const playerCollection = this.mainService.getCollections();
    this.setPlayerList(playerCollection);
  }

  private setPlayerList(playerCollection: Query<DocumentData>) {
    collectionData(playerCollection).pipe(
      tap(players => {
        this.players = players;
      }),
      catchError(() => of('Execution error'))
    ).subscribe();
  }

  private initPlayerFilteredForm() {
    this.playerFilteredForm = new FormGroup({
      nameToFilter: new FormControl(''),
    });
  }

  private initAddPlayerForm() {
    this.addPlayerForm = new FormGroup({
      name: new FormControl(''),
      number: new FormControl(''),
      position: new FormControl(''),
      age: new FormControl(''),
    });
  }

  private filterPlayerByName(playerCollection: Query<DocumentData>, playerFilteredForm: FormGroup) {
    collectionData(playerCollection).pipe(
      tap(players => {
        this.players = players.filter(player => player['name']?.toLowerCase().includes(playerFilteredForm.value.nameToFilter.toLowerCase()));
      }),
      catchError(() => of('Execution error'))
    ).subscribe();
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    this.fileToUpload = file;
  }
}
