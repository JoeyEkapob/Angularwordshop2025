import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SigninComponent } from './signin/signin.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,SidebarComponent,SigninComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 token: string | undefined ;

 ngOnInit(){
  if (typeof window !== 'undefined') {
    this.token = localStorage.getItem('angular_token') ?? undefined;
  }

 }
}
