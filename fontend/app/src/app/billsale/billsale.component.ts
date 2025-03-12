import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs'
import config from '../../config';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-billsale',
  imports: [FormsModule],
  templateUrl: './billsale.component.html',
  styleUrl: './billsale.component.css'
})
export class BillsaleComponent {
  constructor(private http: HttpClient){}

  billsales : any[] =[]
  startdate : string = dayjs().startOf('month').format('YYYY-MM-DD')
  enddate : string = dayjs().endOf('month').format('YYYY-MM-DD')
  dayjs = dayjs

  ngOnInit(){
    this.fetchdata();
    console.log(this.startdate)
  }

  fetchdata(){
    const payload = {
      startdate : new Date(this.startdate),
      enddate : new Date(this.enddate)
    }
/* console.log( new Date(this.startdate))

    return   */
    this.http.post(config.apiServer + '/api/billsale/list',payload ).subscribe((res:any)=>{
      this.billsales = res.results
      console.log( this.billsales )
    })
  }
  async remove(id:number){
    const button = await Swal.fire({
      title:'คุณต้องการลบรายการนี้ใช่หรือไม่',
      text:'รายการนี้จะลูกลบอย่างถาวร',
      icon:'question',
      showCancelButton:true,
      showConfirmButton:true,
      
    })
    if(button.isConfirmed){
      this.http.delete(config.apiServer + '/api/billsale/remove/'+id).subscribe((res:any)=>{
        this.fetchdata()
      })
    }
  }
}
