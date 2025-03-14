import { Component } from '@angular/core';
import dayjs from 'dayjs';
import config from '../../config';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reportsumperday',
  imports: [FormsModule],
  templateUrl: './reportsumperday.component.html',
  styleUrl: './reportsumperday.component.css'
})
export class ReportsumperdayComponent {
  constructor(private http:HttpClient){}
  ddlyear : number[] = []
  ddlmount : string[] = []
  data: any[] = []
  year: number = dayjs().year()
  month:number = dayjs().month() + 1 
  dayjs:typeof dayjs = dayjs

  ngOnInit(){
    this.ddlyear = this.getYear()
    this.ddlmount = this.getMonth()

    this.fetchData()
  }

  getYear(){
    const currentYear = dayjs().year()
    return Array.from({length: 5 },(_,i)=>currentYear - i)
  }
  getMonth(){
    const thaiMonths = [
      "มกราคม",  // January
      "กุมภาพันธ์", // February
      "มีนาคม",  // March
      "เมษายน",  // April
      "พฤษภาคม", // May
      "มิถุนายน", // June
      "กรกฎาคม", // July
      "สิงหาคม", // August
      "กันยายน", // September
      "ตุลาคม", // October
      "พฤศจิกายน", // November
      "ธันวาคม"  // December
    ]; 
    return thaiMonths
  }
  fetchData(){
    const payload = {
      year:this.year,
      month:this.month
    }
    this.http.post(config.apiServer + '/api/report/sumperdayinyearandmonth',payload).subscribe((res:any)=>{
      this.data = res.results
    })
  }
}
