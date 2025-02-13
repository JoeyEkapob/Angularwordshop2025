import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import  config  from '../../config';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  imports: [FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
  constructor(private http: HttpClient){}

  foods:any[]=[]
  saletemps:any[]=[]
  apiPath:string='';
  tableno:number = 1;
  userId: number = 0;


  ngOnInit(){
    this.fetchData();
    this.fetchdatasaletemp()

    this.apiPath = config.apiServer;

    const userId = localStorage.getItem('angular_id')
   
    if(userId !== null){
      this.userId = parseInt(userId)
      this.fetchdatasaletemp()
    }
  }
 
  fetchData(){
    try{
      this.http.post(config.apiServer + '/api/food/list',{}).subscribe((res:any)=>{
        this.foods = res.result
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }
  filter(foodtype:string){
    try{
      this.http.post(config.apiServer+'/api/food/filter/',{foodtype}).subscribe((res:any)=>{
        this.foods = res.result
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }
  savetosaletemp(item:any){

  try{
      const userId = localStorage.getItem('angular_id')
      const payload = {
        qty:1,
        tableno : this.tableno,
        foodid:item.id,
        userid:this.userId
      }
     /*  console.log(payload,item)
      return */
      this.http.post(config.apiServer +'/api/saletemp/create',payload).subscribe((res:any)=>{
        this.fetchdatasaletemp()
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    } 
  }
  fetchdatasaletemp(){
    try{
    /*   console.log(this.userId)
      return */
      const payload = {
        userId: this.userId
      }
      this.http.post(config.apiServer+'/api/saletemp/list',payload).subscribe((res:any)=>{
        /* console.log(res.results) */
        this.saletemps = res.results
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
    
  }

  async clearallrow(){
    const button = await Swal.fire({
      title:'ล้างรายการ',
      text:'คุณต้องการล้างรายการทั้งหมดใช่หรือไม่',
      showCancelButton:true,
      showConfirmButton:true,
      icon:'question',
    })
    if(button.isConfirmed){
      this.http.delete(config.apiServer +'/api/saletemp/clear/'+this.userId).subscribe((res:any)=>{
        this.fetchdatasaletemp();
      })
    }
  }
}
