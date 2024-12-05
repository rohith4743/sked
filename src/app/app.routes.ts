import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch : "full"
    },
    {
        path : "login",
        component: LoginComponent,
        title: "Sked Login"
    },
    {
        path : "signup",
        component : SignupComponent,
        title : "Sked Signup"
    },
    {
        path : "home",
        component : HomeComponent,
        title : "Sked Home",
        canActivate: [authGuard]
    },
    {
        path : "**",
        component: PageNotFoundComponent
    }
];
