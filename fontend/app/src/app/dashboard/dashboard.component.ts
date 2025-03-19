import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import config from '../../config';
import dayjs from 'dayjs';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  incomeperday : any [] = []
  incomepermonths : any [] = []
  years: number[] = []
  monthsname: string[] = []
  days: number[] = []
  dayjs: typeof dayjs = dayjs
  year: number = dayjs().year()
  month:number = dayjs().month()+1

  constructor(private http:HttpClient){}

  ngOnInit(){
    const totaldayinmonth = dayjs().daysInMonth()

    this.days= Array.from({length:totaldayinmonth} , (_,i) => i + 1 )

    this.years = Array.from({ length: 20 }, (_, i) => dayjs().year() - i);
        
    this.monthsname = [
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

    this.fetchdata()
  }

  fetchdata(){
    console.log(this.years)
    console.log(this.years)
    return
    this.fetehdatasumperdayinyearandmonth()
    this.fetehdatasumpermonthinyear()
  }

  createbarchartdays(){
    let labels:number [] = []
    let datas:number [] = []

    for(let i = 0 ; i < this.incomeperday.length;i++){
      const item = this.incomeperday[i]
      labels.push(i + 1)
      datas.push(item.amount)
    }
    
    const ctx = document.getElementById('chartperday') as HTMLCanvasElement;
    new Chart(ctx,{
      type:'bar',
      data:{
        labels : labels,
        datasets : [{
          label:'รายรับรวมตามวัน (บาท)',
          data: datas,
          borderWidth:1,
        }]
      },
      options:{
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })
  }
  fetehdatasumperdayinyearandmonth(){
    try{
      const payload = {
        year: this.year,
        month: this.month
      }
    
      this.http.post(config.apiServer + '/api/report/sumperdayinyearandmonth',payload).subscribe((res:any)=>{
        this.incomeperday = res.results
        this.createbarchartdays()
      })
  
    }catch(e:any){
      Swal.fire({
        icon:'error',
        title:'error',
        text:e.message
      })
    }
    
  }

  createbarchartmonths(){


  let datas : number [] = []
    for(let i = 0;i < this.incomepermonths.length; i++){
      const item = this.incomepermonths[i];
 
      datas.push(item.amount)
    }
    const ctx = document.getElementById('chartpermonth') as HTMLCanvasElement
    new Chart(ctx,{
      type: 'bar',
      data:{
        labels:this.monthsname,
        datasets:[{
          label:'รายรับรวมตามเดือน (บาท)',
          data: datas,
          borderWidth:1
        }]
      },
      options:{
        scales:{
          y:{
            beginAtZero:true
          }
        }
      }
    })  
  }
  fetehdatasumpermonthinyear(){
  try{
      const payload = {
        year:this.year
      }
    
      this.http.post(config.apiServer + '/api/report/sumpermonthinyear',payload).subscribe((res:any)=>{
        this.incomepermonths = res.results
      
     /*    console.log( this.incomepermonths ) */
     this.createbarchartmonths()
      })
    }catch(e:any){
      Swal.fire({
        icon:'error',
        title:'error',
        text:e.message
      })
    } 
  }

}
