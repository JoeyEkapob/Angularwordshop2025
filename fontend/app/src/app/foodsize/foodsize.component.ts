import { Component } from '@angular/core';
import { MymodalComponent } from "../mymodal/mymodal.component";
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import  config  from '../../config';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-foodsize',
  standalone: true, 
  imports: [MymodalComponent,RouterLink,FormsModule],
  templateUrl: './foodsize.component.html',
  styleUrl: './foodsize.component.css'
})
export class FoodsizeComponent {

  constructor(private http:HttpClient){}

  foodType:any[] = []
  foodsize:any[] = []
  id : number = 0;
  name: string='';
  price:number = 0 ;
  remark:string = '';
  foodtypeid: number = 0

  ngOnInit(){
    this.fetchdatafoodtype()
    this.fetchdata()
  }


  fetchdatafoodtype(){
    this.http.post(config.apiServer + '/api/foodtype/list',{}).subscribe((res:any)=>{
      this.foodType =res.result
      this.foodtypeid = this.foodType[0].id
    })
  }
  save(){
    const payload = {
      name: this.name,
      price: this.price,
      remark : this.remark,
      id: this.id,
      foodtypeid: this.foodtypeid
    }

    if(this.id > 0){
      this.http.put(config.apiServer + '/api/foodsize/update',payload).subscribe((res:any)=>{
        this.fetchdata()
      })
    }else{
      this.http.post(config.apiServer + '/api/foodsize/create',payload).subscribe((res:any)=>{
        this.fetchdata()
        this.id = 0;
      })
    }
    document.getElementById('modalFoodSize_btnClose')?.click()
  }
  fetchdata(){
    try{
      this.http.post(config.apiServer + '/api/foodsize/list',{}).subscribe((res:any)=>{
        this.foodsize = res.result
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }
  async remove(item:any){
    try{
      const button =await Swal.fire({
        title:'ลบข้อมูล',
        text:'คุณต้องการลบข้อมูลใช่หรือไม่',
        icon:'question',
        showCancelButton:true,
        showConfirmButton:true,
      })

      if(button.isConfirmed){
        this.http.delete(config.apiServer + '/api/foodsize/remove/'+ item.id).subscribe((res:any)=>{
          this.fetchdata()
        })
      }
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }

  edit(item:any){
    this.id = item.id;
    this.name = item.name
    this.remark = item.remark
    this.foodtypeid = item.foodtypeid
    this.price = item.moneyadded
  }
}
