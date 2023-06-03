import { Component } from '@angular/core';
import { Firestore, collection, getDocs, where, query } from '@angular/fire/firestore';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup;
  dataLoading: boolean = false;
  unregistered: boolean = false;
  invalid: boolean = false;
  isSubmited = false;

  constructor(
    private router: Router,
    private firestore: Firestore,
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(1)]),
      password: new FormControl('', [Validators.required, Validators.minLength(1)]),
    })
  }

  async loginUser(loginForm: FormGroup) {

    this.isSubmited = true;

    if (loginForm.valid) {
      const login = {
        userName: loginForm.value.userName,
        password: loginForm.value.password,
      };

      const coleccion = query(collection(this.firestore, 'account'), where('userName', '==', login.userName), where('password', '==', login.password))
      const documentos = await getDocs(coleccion);

      if (documentos.docs.length == 1) {
        this.unregistered = false;
        sessionStorage.setItem('userLogged', login.userName);
        this.router.navigate(['/principal'])

      } else {
        this.unregistered = true;
      }
    }
  }
}
