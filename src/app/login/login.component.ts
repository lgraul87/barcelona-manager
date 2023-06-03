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

  get email() { 
    return this.loginForm.get('email'); 
  }

  get password() { 
    return this.loginForm.get('password'); 
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    })
  }

  async loginUser(loginForm: FormGroup) {

    this.isSubmited = true;

    if (loginForm.valid) {
      const login = {
        email: loginForm.value.email,
        password: loginForm.value.password,
      };

      const coleccion = query(collection(this.firestore, 'account'), where('userName', '==', login.email), where('password', '==', login.password))
      const documentos = await getDocs(coleccion);

      if (documentos.docs.length == 1) {
        this.unregistered = false;
        sessionStorage.setItem('userLogged', login.email);
        this.router.navigate(['/main'])

      } else {
        this.unregistered = true;
      }
    }
  }
}
