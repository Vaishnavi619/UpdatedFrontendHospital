import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Import your component
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
// ... other imports

const routes: Routes = [
  { path: '', component: HomeComponent }, // Home page at root path
  { path: 'signup', component: RegisterComponent },
  { path: 'signin', component: LoginComponent },
  // ... other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }