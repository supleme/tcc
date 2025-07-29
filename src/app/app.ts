import { Component, OnInit, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('gerenciador-extensao');

  ngOnInit(): void {
    initFlowbite();
  }
}
