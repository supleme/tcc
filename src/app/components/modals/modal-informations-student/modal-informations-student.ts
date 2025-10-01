import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iStudent } from '../../../interfaces/iStudent';

@Component({
  selector: 'app-modal-informations-student',
  standalone: false,
  templateUrl: './modal-informations-student.html',
  styleUrl: './modal-informations-student.css'
})
export class ModalInformationsStudent {

  @Input() studentSelect?: iStudent;
  @Output() fecharModal = new EventEmitter();

  constructor(){}

  close(){
    this.fecharModal.emit();
  }
}
