import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup;
  dataLoading = false;
  unregistered = false;
  invalid = false;
  isSubmited = false;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
  }

  async loginUser(loginForm: FormGroup) {
    this.isSubmited = true;
    if (loginForm.valid) {
      const login = {
        email: loginForm.value.email,
        password: loginForm.value.password,
      };

      const colecction = this.loginService.getCollections(login);
      const documents = await this.loginService.getDocuments(colecction);

      if (documents.docs.length == 1) {
        this.unregistered = false;
        sessionStorage.setItem('userLogged', login.email);
        this.router.navigate(['/main'])
      } else {
        this.unregistered = true;
      }
    }
  }
}
