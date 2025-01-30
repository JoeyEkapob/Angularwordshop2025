import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms'

import Swal from 'sweetalert2'

@Component({
  selector: 'app-signin',
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  token: string = '';
  username: string = '';
  password: string = '';

  constructor (private http: HttpClient){}

  ngOnInit(){
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('angular_token')!
      
    }
   
  }

  signIn(){
  /*   console.log('sdfsdf')
    return */
     if(this.username == ""|| this.password == ""){
      Swal.fire({
        title:'ตรวจสอบข้อมูล',
        text: 'โปรดกรอก username หริอ password',
        icon:'error'
      })
 
    }else{
      const payload = {
        username: this.username,
        password: this.password
      }
      try{
        this.http.post('http://localhost:3000/api/user/signin',payload).subscribe((res:any)=>{
          this.token = res.token;
          localStorage.setItem('angular_token',this.token)
          localStorage.setItem('angular_username',res.username)
     

          location.reload()
        },(err:any) => {
          Swal.fire({
            title:'ตรวจสอบข้อมูล',
            text:'username invailid',
            icon:'error'
          })
        })
      }catch(e:any){
          Swal.fire({
            title:'error',
            text:e.message,
            icon:'error'
          })
        }
      }
    } 
  }

