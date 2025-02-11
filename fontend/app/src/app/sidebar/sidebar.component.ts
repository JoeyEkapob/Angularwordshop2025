import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
/* name: string = '';

ngOnInit(){
  this.name = localStorage.getItem('angular_name')!
} */
  name:string ='';
  ngOnInit(){
    this.name = localStorage.getItem('angular_username')!;
  }
  async signout(){
    const button = await Swal.fire({
      title:'ออกจากระบบ',
      text: 'คุณต้องการออกจากระบบ ใช่หรือไม่',
      icon:'question',
      showCancelButton:true,
      showConfirmButton:true,
    })

    if(button.isConfirmed){
      localStorage.removeItem('angular_token')
      localStorage.removeItem('angular_username')
      localStorage.removeItem('angular_id')

      location.reload()
    }
  }
}
