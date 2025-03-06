import { Component, Output, EventEmitter } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

constructor(private router: Router) {}
  @Output() logout = new EventEmitter<void>(); // Criando o evento

  chamarLogout() {
    this.logout.emit(); // Emitindo o evento para o pai
    this.router.navigate(['login'])
  }
}
