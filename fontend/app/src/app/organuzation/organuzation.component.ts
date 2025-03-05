import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import config from '../../config';
import Swal from 'sweetalert2';
import { firstValueFrom, switchMap } from 'rxjs';



@Component({
  selector: 'app-organuzation',
  imports: [FormsModule],
  templateUrl: './organuzation.component.html',
  styleUrl: './organuzation.component.css'
})


export class OrganuzationComponent {
  constructor(private http:HttpClient){ }

  name:string =''
  phone :string=''
  address:string=''
  taxCode:string=''
  id : Number = 0;
  logo : string = ''
  email:string = ''
  website:string=''
  promptPay:string=''
  myFile:any
  logoPath: string = ''

  ngOnInit(){
    this.http.post(config.apiServer + '/api/organization/info',{}).subscribe(([data]:any)=>{
      /*  console.log(data[0].promptPay) */
      this.name = data.name;
      this.phone = data.phone;
      this.address = data.address;
      this.taxCode = data.taxcode;
      this.id = data.id
      this.logo = data.logo
      this.email =data.email
      this.website = data.website
      this.promptPay = data.promptpay 
      this.logoPath = config.apiServer + '/uploads/' + this.logo
    
    })

  }
  
  async save(){
    const filename = await this.upload()
    const payload = {
      name : this.name,
      phone :this.phone,
      address :this.address,
      taxCode : this.taxCode,
      id : this.id,
      logo : filename,
      email : this.email,
      website : this.website,
      promptPay : this.promptPay,
    }

    this.http.post(config.apiServer + '/api/organization/save', payload).pipe(
      switchMap((response: any) => {
       console.log(response) 
        return this.http.get(config.apiServer + `/api/organization/list/${response}`);
      })
    ).subscribe((updatedData: any) => {
      /* console.log(updatedData) */
      /* this.organizationData = updatedData; */ // อัปเดตข้อมูลใน UI
      this.name = updatedData.name;
      this.phone = updatedData.phone;
      this.address = updatedData.address;
      this.taxCode = updatedData.taxcode;
      this.id = updatedData.id
      this.logo = updatedData.logo
      this.email =updatedData.email
      this.website = updatedData.website
      this.promptPay = updatedData.promptpay 
      this.logoPath = config.apiServer + '/uploads/' + this.logo

      Swal.fire({
        icon: 'success',
        text: 'อัปเดตข้อมูลสำเร็จ!',
        title: 'บันทึกข้อมูล',
        showCancelButton: false,
        timer: 1500
      });
    });
   }

   
  onFileChange(event:any){
    if(event.target.files != null){
      if(event.target.files.length > 0){
        this.myFile = event.target.files[0]
      }
    }
  }

  async upload(){
    if(this.myFile !== undefined){
      const formData = new FormData()
      formData.append('myFile',this.myFile)
      const url = config.apiServer + '/api/organization/upload';
      const res:any = await firstValueFrom(this.http.post(url,formData))

      return res.filename
    }
  }
  
}
