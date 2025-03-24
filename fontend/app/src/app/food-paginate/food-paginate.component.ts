import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import config from '../../config';

@Component({
  selector: 'app-food-paginate',
  imports: [],
  templateUrl: './food-paginate.component.html',
  styleUrl: './food-paginate.component.css'
})
export class FoodPaginateComponent {
  constructor(private http: HttpClient) {}

  foods: any [] = []
  total: number = 0 
  page:number = 1
  pagesize:number=5
  totalpage :  number = 0
  totalpagearray : number[] = [];
  

  ngOnInit(){
    this.fetchdata();
  }
  changepage(page:number){
 /*    console.log(page) */
    this.page = page;
    this.fetchdata()
  }

  async fetchdata(){
    try{
      const payload = {
        page: this.page,
        pagesize : this.pagesize
      }
     console.log(payload)
    /*    return */

      this.http.post(config.apiServer + '/api/food/listpaginate',payload).subscribe((res:any)=>{
    /*     console.log(res.results) */
 /*      console.log(res.total[0].total)  */
        this.foods = res.results
        this.total = res.total[0].total

        this.totalpage = Math.ceil(this.total / this.pagesize)
      
        this.totalpagearray = Array.from({length:this.totalpage},(_,i)=>i + 1 )
        console.log(this.totalpagearray)
      })
    }catch(error){
      console.error(error)
    }
  }
}
