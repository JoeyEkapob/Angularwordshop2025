import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import config from '../../config';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-reportsumpermonth',
  imports: [FormsModule],
  templateUrl: './reportsumpermonth.component.html',
  styleUrl: './reportsumpermonth.component.css'
})
export class ReportsumpermonthComponent {
  constructor(private http: HttpClient){}

  year: number = dayjs().year();
  ddyear: number[] = [];
  
  data: any[] = []


  ngOnInit(){
    this.ddyear = Array.from({ length: 10 }, (_, i) => this.year - i);

    this.fetchdata()
  }

  fetchdata(){
    try{
/*         console.log(this.ddyear ) */
   
      const payload = {
        year : this.year
      }

      const token = localStorage.getItem('angular_token')!
      const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`)
      
      
      this.http.post(config.apiServer + '/api/report/sumpermonthinyear',payload,{headers : headers}).subscribe((res:any)=>{
        this.data = res.results
      })
    }catch(e:any){
      Swal.fire({
        icon:'error',
        title:'error',
        text:e.message
      })
    }
  }
}
