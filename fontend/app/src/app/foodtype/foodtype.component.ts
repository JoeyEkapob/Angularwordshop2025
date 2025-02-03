import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import config from '../../config';
import Swal from 'sweetalert2';
import { MymodalComponent } from "../mymodal/mymodal.component";
import { title } from 'process';


@Component({
  selector: 'app-foodtype',
  imports: [FormsModule, MymodalComponent],
  templateUrl: './foodtype.component.html',
  styleUrl: './foodtype.component.css'
})
export class FoodtypeComponent {
  name: string = '';
  remark: string = '';
  foodtypes: any = [];
  id: number = 0;
  constructor(private http: HttpClient) { }

  clearForm(){
    this.name= '';
    this.remark= '';
    this.id = 0;

  }

  save() {
    try {
      const payload = {
        name: this.name,
        remark: this.remark,
        id:0,
      }
      if(this.id > 0){
        payload.id = this.id;
        this.http.put(config.apiServer + '/api/foodtype/update',payload).subscribe((res:any)=>{
          this.fetchData();
          this.id = 0
        })
      }else{
        this.http.post(config.apiServer + '/api/foodtype/create', payload).subscribe((res) => {
          this.fetchData()
        })
      }
      document.getElementById('modalFoodType_btnClose')?.click()
    
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
  ngOnInit() {
  
    this.fetchData(); // ต้องมั่นใจว่า method นี้มีอยู่จริง
  }

  fetchData(){
    this.http.post(config.apiServer + '/api/foodtype/list', {}).subscribe((res :any) => {
      this.foodtypes = res.result;
    });
  }

     async remove (item:any){
      try{
        const button = await Swal.fire({
          title:'ลบรายการ',
          text:'คุณต้องการลบรายการใช่หรือไม่',
          icon:'question',
          showCancelButton:true,
          showConfirmButton:true,
        })

        if(button.isConfirmed){
          this.http.delete(config.apiServer + '/api/foodtype/remove/' + item.id).subscribe((res:any)=>{
            this.fetchData();
          })
          Swal.fire({
            title:'เสร็จสิ้น',
            icon:'success',
            timer:2000
          })
        }
      }catch(e :any){
        Swal.fire({
          title:'error',
          text:e.message,
          icon:'error'
        })
      }
    }

    edit(item:any){
      this.name = item.name;
      this.remark = item.remark;
      this.id = item.id;
    }

   
}
