import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mymodal',
  imports: [],
  templateUrl: './mymodal.component.html',
  styleUrl: './mymodal.component.css'
})
export class MymodalComponent {
  @Input() modalId: string =''
  @Input() title: string=''
}
