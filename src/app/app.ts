import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('gerenciador-extensao');

  constructor(public router: Router, private http: HttpClient) {}
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
  ngOnInit(): void {
    initFlowbite();
  }
}
