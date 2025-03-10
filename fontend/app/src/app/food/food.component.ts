import { Component } from '@angular/core';
import { MymodalComponent } from "../mymodal/mymodal.component";
import { HttpClient } from '@angular/common/http';
import config  from '../../config';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { table } from 'console';

@Component({
  selector: 'app-food',
  imports: [MymodalComponent,FormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.css'
})
export class FoodComponent {

  constructor(private http:HttpClient){}

  foodtypes :any[] = []
  foods:any[] = []
  name: string = ''
  filename :string = ''
  price : number = 0
  remark : string =''
  foodtype: string = 'food'
  id:number = 0
  foodtypeid :number = 0;
  file:File | undefined = undefined;
  serverpath : string = ''
  img : string = '';

  ngOnInit(){
    this.fetchdata();
    this.fetchdatafoodtypes()

    this.serverpath = config.apiServer
  }

  fileselected(file :any) {
    
 if(file.files != undefined){
      if(file.files.length > 0){
        this.file = file.files[0]
      }
    } 
  }

  async uploadfile(){
    try{
      if(this.file !== undefined){
        const formdata = new FormData()
        formdata.append('img',this.file)

   /*      return console.log(formdata) */
        
        const res:any = await firstValueFrom(
          this.http.post(config.apiServer + '/api/food/upload',formdata)
        )
        return res.filename
      }
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }

  async fetchdata(){
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

  async fetchdatafoodtypes(){
    try{
      this.http.post(config.apiServer + '/api/foodtype/list',{}).subscribe((res:any)=>{
        this.foodtypes = res.result
        this.foodtypeid = this.foodtypes[0].id
      })
    }catch(e :any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }

 async save(){
    try{

       const filename = await this.uploadfile() 
    
    
      const payload ={
        foodtypeid : parseInt(this.foodtypeid.toString()),
        name:this.name,
        img: filename ?? '' ,
        price :this.price,
        remark:this.remark,
        foodtype:this.foodtype,
        id:this.id,

      }

   /* return console.log(payload) */
      if(this.id > 0){
        this.http.put(config.apiServer +'/api/food/update',payload).subscribe((res:any)=>{
          this.fetchdata()
          this.id = 0;
        })
      }else{
        this.http.post(config.apiServer +'/api/food/create',payload).subscribe((res:any)=>{
          this.fetchdata()
        })
      }
      document.getElementById('modalFood_btnClose')?.click()
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }
  clearForm(){
    this.name = '';
    this.price = 0;
    this.file = undefined;
    this.remark ='';
    this.foodtype='food';
    this.id = 0
    this.img = '';
    const img = document.getElementById('img') as HTMLInputElement
    img.value = ''
  }
  async remove(item:any){
    try{
      /* console.log('llll')
      return */
      const button = await Swal.fire({
        title:'ลบรายการ',
        text: 'คุณต้องการลบรายการใช่หริอไม่',
        icon:'question',
        showCancelButton:true,
        showConfirmButton:true
      })

      if(button.isConfirmed){
        this.http.delete(config.apiServer + '/api/food/remove/'+item.id).subscribe((res:any)=>{
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
 /*    console.log(item)
    return  */
    this.id = item.id
    this.name = item.name
    this.foodtypeid = item.foodtypeid
    this.foodtype= item.foodtype
    this.remark = item.remark
    this.price = item.price 
    this.img = item.img
    this.file = undefined;

    const img = document.getElementById('img') as HTMLInputElement
    img.value = '';

   
  }
  filterfood(){
    this.filter('food')

  }
  filterdrink(){
    this.filter('drink')
  }
  filterall(){
    this.fetchdata()
  }
  filter(foodtype:string){
 /*    console.log(foodtype)
    return */
   
    try{
      this.http.post(config.apiServer + '/api/food/filter',{foodtype}).subscribe((res:any)=>{
        this.foods = res.result
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error',
      })
    }
  }
  
}
