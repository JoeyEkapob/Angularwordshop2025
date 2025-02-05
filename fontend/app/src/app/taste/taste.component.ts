import { Component } from '@angular/core';
import { MymodalComponent } from "../mymodal/mymodal.component";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import config from '../../config';


@Component({
  selector: 'app-taste',
  imports: [MymodalComponent,FormsModule],
  templateUrl: './taste.component.html',
  styleUrl: './taste.component.css'
})
export class TasteComponent {

  constructor(private http:HttpClient){ }

  id:number = 0
  foodtypeid:number =0
  name:string=''
  remark: string =''
  taste: any[] = []
  foodtypes:any[] = []

  ngOnInit(){
    this.fetchdatafoodtypes()
    this.fetchdata()
  }
  fetchdatafoodtypes(){
    try{
      this.http.post(config.apiServer + '/api/foodtype/list',{}).subscribe((res:any)=>{
        this.foodtypes = res.result
        this.foodtypeid = this.foodtypes[0].id
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }

  fetchdata(){
    try{
      this.http.post(config.apiServer + '/api/taste/list',{}).subscribe((res:any)=>{
        this.taste = res.result
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
    
  }

  save(){
    try{
      const payload = {
        id:this.id,
        foodtypeid :parseInt(this.foodtypeid.toString()),
        name: this.name,
        remark: this.remark         
      }
      if(this.id > 0){
        this.http.put(config.apiServer + '/api/taste/update',payload).subscribe((res:any)=>{
          this.fetchdata()
          this.id = 0
        })
      }else{
        this.http.post(config.apiServer + '/api/taste/create',payload).subscribe((res:any)=>{
          this.fetchdata()
        })
      }

      document.getElementById('modalTaste_btnClose')?.click();
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }

  edit(item:any){
    this.foodtypeid = item.foodtypeid;
    this.name = item.name;
    this.id = item.id;
    this.remark = item.remark
  }

  async remove(item:any){
    try{
      const button = await Swal.fire({
        title:'ลบข้อมูล',
        text: 'คุณต้องการลบข้อมูลใช้หริอไม่',
        icon: 'question',
        showCancelButton:true,
        showConfirmButton:true,
      })

      if(button.isConfirmed){
        this.http.delete((config.apiServer +'/api/taste/remove/' + item.id)).subscribe((res:any)=>{
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
}
