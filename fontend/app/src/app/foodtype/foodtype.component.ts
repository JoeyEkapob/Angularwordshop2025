import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import config from '../../config';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-foodtype',
  imports: [FormsModule],
  templateUrl: './foodtype.component.html',
  styleUrl: './foodtype.component.css'
})
export class FoodtypeComponent {
  name: string = '';
  remark: string = '';
  constructor(private http: HttpClient) { }

  save() {
    try {
      const payload = {
        name: this.name,
        remark: this.remark,
      }
      this.http.post(config.apiServer + '/api/foodtype/create', payload).subscribe((res) => {
        console.log(res)
      })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

}
