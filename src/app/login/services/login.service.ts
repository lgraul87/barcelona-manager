import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, where, query, DocumentData, Query } from '@angular/fire/firestore';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private firestore: Firestore,) { }

  getCollections(login: User) {
    return query(collection(this.firestore, 'account'), where('email', '==', login.email), where('password', '==', login.password))
  }

  async getDocuments(colecction: Query<DocumentData>) {
    return await getDocs(colecction);
  }
}
