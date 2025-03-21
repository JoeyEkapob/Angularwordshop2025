import { Component } from '@angular/core';
import { RouterLink  , Router } from '@angular/router';
import Swal from 'sweetalert2';
import config from '../../config';
import { HttpClient, HttpHeaders  } from '@angular/common/http';


@Component({
  selector: 'app-sidebar',
  standalone: true, 
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private http:HttpClient , private router:Router){}
/* name: string = '';

ngOnInit(){
  this.name = localStorage.getItem('angular_name')!
} */
  name:string ='';
  level : Number = 0 ;

  ngOnInit(){
    this.name = localStorage.getItem('angular_username')!;
    this.getlevelfromtoken()
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
      this.router.navigate(['/'])
    }
  }
  getlevelfromtoken(){
    const token = localStorage.getItem('angular_token')!;
    const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`)

    this.http.get(config.apiServer + '/api/user/getlevelfromtoken',{headers:headers}).subscribe((res:any)=>{
      this.level = res.level
/*       console.log(this.level) */
    })
  }
}
