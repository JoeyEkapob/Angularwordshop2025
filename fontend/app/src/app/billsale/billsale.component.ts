import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs'
import config from '../../config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-billsale',
  imports: [FormsModule],
  templateUrl: './billsale.component.html',
  styleUrl: './billsale.component.css'
})
export class BillsaleComponent {
  constructor(private http: HttpClient){}

  billsale : any[] =[]
  startdate : string = dayjs().startOf('month').format('YYYY-MM-DD')
  enddate : string = dayjs().endOf('month').format('YYYY-MM-DD')
  dayjs = dayjs

  ngOnInit(){
    this.fetchdata();
  }

  fetchdata(){
    const payload = {
      startdate : new Date(this.startdate),
      enddate : new Date(this.enddate)
    }

    this.http.post(config.apiServer + '/api/billsale/list',payload ).subscribe((res:any)=>{
      this.billsale = res.results
    })
  }
}
