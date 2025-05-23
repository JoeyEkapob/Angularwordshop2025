import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import config from '../../config';
import dayjs from 'dayjs';
import { Chart } from 'chart.js/auto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  chartInstance: Chart | null = null;
  chartInstance2: Chart | null = null;
 

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
   /*   console.log(this.chartInstance)
    */
    const canvas = document.getElementById('chartperday') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d'); 
/*   console.log(ctx)
  console.log(this.chartInstance) */


    if (!ctx) {
      console.error("Canvas context is null");
      return;
    }
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
/*   console.log(this.chartInstance) */


    /* console.log("Before destroy:", this.chartInstance);
    if (this.chartInstance) {
      console.log(this.chartInstance)
      this.chartInstance.destroy();
      this.chartInstance = null;
  } */
  /* console.log(ctx)

  console.log(ctx.width)
  
  ctx.width = ctx.width; */

  this.chartInstance =  new Chart(ctx,{
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

    /* console.log(this.chartInstance) */
  }
  
  fetehdatasumperdayinyearandmonth(){
    try{
      const payload = {
        year:  Number(this.year),
        month:  Number(this.month)
      }
        const token = localStorage.getItem('angular_token')!
         const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`)
         
    
      this.http.post(config.apiServer + '/api/report/sumperdayinyearandmonth',payload,{headers:headers}).subscribe((res:any)=>{
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

    console.log()
    const canvas = document.getElementById('chartpermonth') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');  
/*     console.log(this.chartInstance) */
   /*  */

    if (!ctx) {
      console.error("Canvas context is null");
      return;
    }
    if (this.chartInstance2) {
      this.chartInstance2.destroy();
    } 
    
      this.chartInstance2 =  new Chart(ctx,{
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
        year:  Number(this.year)
      }
      const token = localStorage.getItem('angular_token')!
      const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`)

      this.http.post(config.apiServer + '/api/report/sumpermonthinyear',payload,{headers:headers}).subscribe((res:any)=>{
        this.incomepermonths = res.results
    /*     console.log(this.incomepermonths)
        return */
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
