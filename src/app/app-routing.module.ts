import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

const routes: Routes =
  [
    { path: '', component: LoginComponent },
    { path: 'main', component: MainComponent },
    { path: 'profile-modal', component: ProfileModalComponent }
  ]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
