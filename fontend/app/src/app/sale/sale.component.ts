import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import  config  from '../../config';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MymodalComponent } from '../mymodal/mymodal.component';

@Component({
  selector: 'app-sale',
  imports: [FormsModule, MymodalComponent],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {
  constructor(private http: HttpClient){}

  foods:any=[]
  saletemps:any=[]
  apiPath:string='';
  tableno:number = 1;
  userId: number = 0;
  amount:number = 0;
  foodsizes : any =[]
  saletempid : number = 0
  foodname:string=''
  saletempdetail : any =[]


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
        this.saletemps = res.results
       /*  console.log(saletemps)  */

        this.amount = 0;

        for(let i = 0 ; i < this.saletemps.length; i++){
          const item = this.saletemps[i]
          const qty = item.qty;
          const price = item.price
  
          this.amount += qty * price 
        }
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

  async removeitem(item:any){
    /* console.log('5')
    return */
    try{
      const button = await Swal.fire({
        title:'ลบ' + item.name,
        text:'คุณต้องการลบรายการใช่หรือไม่',
        icon:'question',
        showCancelButton:true,
        showConfirmButton:true,
      })
      if(button.isConfirmed){
        this.http.delete(config.apiServer + '/api/saletemp/remove/'+ item.foodid+ '/'+ this.userId).subscribe((res:any)=>{
          this.fetchdatasaletemp()
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
  
  changeqty(id:number,style:string){
    try{
      const payload = {
        id:id,
        style:style,
      }
      this.http.put(config.apiServer + '/api/saletemp/changeqty',payload).subscribe((res:any)=>{
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

  choosefoodsize(item:any){
   /*  console.log(item)
  
    return  */
   let foodtypeid: number = item.foodtypeid
    this.saletempid = item.id;
    this.foodname = item.name 

      
    try{
      this.http.post(config.apiServer + '/api/foodsize/filter/',{foodtypeid}).subscribe((res:any)=>{
        this.foodsizes = res.result
      })

      const payload = {
        foodid : item.foodid,
        qty:item.qty,
        saletempid : item.id,
      }
      this.http.post(config.apiServer + '/api/saletemp/createdetail',payload).subscribe((res:any)=>{
        this.fetchdatasaletempdetail()
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }

  fetchdatasaletempdetail(){
    let saletempid = this.saletempid
    this.http.post(config.apiServer + '/api/saletemp/listsaletempdetail',{saletempid}).subscribe((res:any)=>{
      this.saletempdetail = res.result
    })
  }
 
}
