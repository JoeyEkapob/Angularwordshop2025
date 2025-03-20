import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import config from '../../config';
import { MymodalComponent } from '../mymodal/mymodal.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user',
  imports: [ MymodalComponent , FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  constructor(private http: HttpClient){}

  users: any [] = []
  email:string = '';
  username : string = '';
  password : string = '';
  level : string = 'employee';
  id : number = 0;


  ngOnInit(){
    this.fetchData()
  }

  fetchData(){
      try{
      this.http.post(config.apiServer + '/api/user/list',{}).subscribe((res:any)=>{
        this.users = res.results
      })
    }catch(e:any){
      Swal.fire({
        icon:'error',
        title:'error',
        text:e.message,
      })
    } 
  }

  save(){
    try{
      const payload = {
        name:this.email,
        username:this.username,
        password:this.password,
        level:this.level,
      }
      this.http.post(config.apiServer + '/api/user/create',payload).subscribe((res:any) => {
        this.fetchData()
        this.email = '';
        this.username = '';
        this.password = '';
        this.level = 'employee';
        this.id = 0

        document.getElementById('modalUser_btnClose')?.click()
      })
    }catch(e:any){
      Swal.fire({
        icon:'error',
        title:'error',
        text:e.message,
      })
    }
  }

  async remove(id:Number){
    try{
      const button = await Swal.fire({
        title:'คุณต้องการลบผู้ใช้งานนี้ใช้หรือไม่',
        icon:'warning',
        showCancelButton:true,
        showConfirmButton:true
      })
      if(button.isConfirmed){
        this.http.delete(config.apiServer+'/api/user/remove/' + id).subscribe((res:any)=>{
          this.fetchData();
        })
      }
    }catch(e:any){
      Swal.fire({
        icon:'error',
        title:'error',
        text:e.message,
      })
    }
  }
}
