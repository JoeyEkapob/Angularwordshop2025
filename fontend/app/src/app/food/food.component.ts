import { Component } from '@angular/core';
import { MymodalComponent } from "../mymodal/mymodal.component";

@Component({
  selector: 'app-food',
  imports: [MymodalComponent],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {
  clearForm(){}
}
