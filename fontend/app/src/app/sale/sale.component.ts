import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import config from '../../config';
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
  constructor(private http: HttpClient) { }

  foods: any = []
  saletemps: any = []
  apiPath: string = '';
  tableno: number = 1;
  userId: number = 0;
  amount: number = 0 ;
  foodsizes: any = []
  saletempid: number = 0
  foodname: string = ''
  saletempdetail: any = []
  tastes:any =[]
  foodid:number = 0
  paytype:string = 'cash'
  inputmoney:number = 0
  returnmoney:number = 0

  chengeinputmoney(inputmoney:number){
    this.inputmoney = inputmoney
    this.returnmoney = this.inputmoney - this.amount
  }

  selectedpaytype(paytype :string){
    this.paytype = paytype;
  }

  getclassname(paytype : string){
    let cssclass = 'btn btn-block btn-lg '

    if(this.paytype == paytype){
      cssclass += 'btn-secondary'
    }else{
      cssclass +='btn-outline-secondary'
    }
    return cssclass
  }
  getclassnameofbutton(inputmoney:number){
    
    let cssclass = 'btn btn-block btn-lg '

    if(this.inputmoney == inputmoney){

      cssclass += 'btn-secondary';
    }else{
      cssclass += 'btn-outline-secondary'
    }

    return cssclass
  }



  ngOnInit() {
    this.fetchData();
    this.fetchdatasaletemp()

    this.apiPath = config.apiServer;

    const userId = localStorage.getItem('angular_id')

    if (userId !== null) {
      this.userId = parseInt(userId)
      this.fetchdatasaletemp()
    }
  }

  fetchData() {
    try {
      this.http.post(config.apiServer + '/api/food/list', {}).subscribe((res: any) => {
        this.foods = res.result
      })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
  filter(foodtype: string) {
    try {
      this.http.post(config.apiServer + '/api/food/filter/', { foodtype }).subscribe((res: any) => {
        this.foods = res.result
      })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
  savetosaletemp(item: any) {

    try {
      const userId = localStorage.getItem('angular_id')
      const payload = {
        qty: 1,
        tableno: this.tableno,
        foodid: item.id,
        userid: this.userId
      }
      /*  console.log(payload,item)
       return */
      this.http.post(config.apiServer + '/api/saletemp/create', payload).subscribe((res: any) => {
        this.fetchdatasaletemp()
      })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }
  fetchdatasaletemp() {
    try {
      /*   console.log(this.userId)
        return */
      const payload = {
        userId: this.userId
      }
      this.http.post(config.apiServer + '/api/saletemp/list', payload).subscribe((res: any) => {
        this.saletemps = res.results

        for( let i = 0; i < this.saletemps.length; i++){
          const item = this.saletemps[i]
          const jsonsaletempdetail = JSON.parse(item.saletempdetail);
          if(item.saletempdetail.length > 0) {
            item.qty = jsonsaletempdetail.length 
           item.disabledQtyButton = true; 
         }
          console.log(jsonsaletempdetail)
        }

      /*   
        for( let i = 0; i < this.saletemps.length; i++){
            const item = this.saletemps[i]

            if(item.saletempdetail.length > 0) {
              item.qty = item.saletempdetail.length */
         /*      item.disabledQtyButton = true; */
         /*    }
        } */
        
        this.computeamount()
        /*  console.log(saletemps)  */

        /*      this.amount = 0; */

        /*  for(let i = 0 ; i < this.saletemps.length; i++){
           const item = this.saletemps[i]
           const qty = item.qty;
           const price = item.price
   
           this.amount += qty * price 
         }  */
        /*        this.computeamount()  */
      })

    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }

  }

  async clearallrow() {
    const button = await Swal.fire({
      title: 'ล้างรายการ',
      text: 'คุณต้องการล้างรายการทั้งหมดใช่หรือไม่',
      showCancelButton: true,
      showConfirmButton: true,
      icon: 'question',
    })
    if (button.isConfirmed) {
      this.http.delete(config.apiServer + '/api/saletemp/clear/' + this.userId).subscribe((res: any) => {
        this.fetchdatasaletemp();
      })
    }
  }

  async removeitem(item: any) {
    /* console.log('5')
    return */
    try {
      const button = await Swal.fire({
        title: 'ลบ' + item.name,
        text: 'คุณต้องการลบรายการใช่หรือไม่',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
      })
      if (button.isConfirmed) {
        this.http.delete(config.apiServer + '/api/saletemp/remove/' + item.foodid + '/' + this.userId).subscribe((res: any) => {
          this.fetchdatasaletemp()
        })
      }
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  changeqty(id: number, style: string) {
    try {
      const payload = {
        id: id,
        style: style,
      }
      this.http.put(config.apiServer + '/api/saletemp/changeqty', payload).subscribe((res: any) => {
        this.fetchdatasaletemp()
      })

    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  choosefoodsize(item: any) {
    /* console.log(item.foodtypeid)
    console.log(item.saletemp_id)
    console.log(item.name)
    console.log(item.food.id)
    return */
    let foodtypeid: number = item.foodtypeid
    this.saletempid = item.saletemp_id
    this.foodname = item.name
    this.foodid = item.foodid
   /*  console.log('item')
    return */
    this.fetchdatataste(foodtypeid)
    try {
      this.http.post(config.apiServer + '/api/foodsize/filter/', { foodtypeid }).subscribe((res: any) => {
        this.foodsizes = res.result
      })
      /*   console.log(item) */
      const payload = {
        foodid: item.foodid,
        qty: item.qty,
        saletempid: item.saletemp_id,
      }
      /*  console.log(payload)
       return */

      this.http.post(config.apiServer + '/api/saletemp/createdetail', payload).subscribe((res: any) => {
        this.fetchdatasaletempdetail()
      })


    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  fetchdatasaletempdetail() {

    let saletempid = this.saletempid
    /*  console.log( this.saletempid)
    return  */
    this.http.post(config.apiServer + '/api/saletemp/listsaletempdetail', { saletempid }).subscribe((res: any) => {
      this.saletempdetail = res.result
        this.computeamount()
    })
  }
  selectedfoodsize(foodsizeid: number, saletempid: number) {
    try {
      const payload = {
        saletempid: saletempid,
        foodsizeid: foodsizeid
      }
      /*  console.log(foodsizeid) 
         console.log(saletempid)  */
      /*  return */
      this.http.post(config.apiServer + '/api/saletemp/updatefoodsize', payload).subscribe((res: any) => {
        this.fetchdatasaletempdetail();
        this.fetchdatasaletemp()
      })
    } catch (e: any) {
      Swal.fire({
        title: 'error',
        text: e.message,
        icon: 'error'
      })
    }
  }

  computeamount() {
    this.amount = 0

    for (let i = 0; i < this.saletemps.length; i++) {
      const item = this.saletemps[i]
      const totalperrow = item.qty * item.price
      const jsonsaletempdetail = JSON.parse(item.saletempdetail);

    /*   console.log(jsonsaletempdetail) */
        for (let j = 0; j < jsonsaletempdetail.length; j++) {

     this.amount += jsonsaletempdetail[j].addedmoney  
   
    }

      
      this.amount += totalperrow
  
   
     

    }
  

   /* console.log(this.saletemps)  */
  }
  fetchdatataste(foodtypeid:number){

    /*  console.log(foodtypeid)
    return  */
    try{
      this.http.post(config.apiServer +'/api/taste/listbyfoodtypeid',{foodtypeid}).subscribe((res:any)=>{
        this.tastes = res.result
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error' 
      })
    }
  }
  selectedtaste(saletempid:number , tasteid:number){
    try{
      const payload = {
        saletempid : saletempid,
        tasteid:tasteid
      }
      this.http.post(config.apiServer + '/api/saletemp/updatetaste',payload).subscribe((res:any)=>{
        this.fetchdatasaletempdetail();
      })
    }catch(e:any){
      Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }
  newsaletempdetail(){
    try{
      const payload = {
        saletempid : this.saletempid,
        foodid: this.foodid
      }
      this.http.post(config.apiServer + '/api/saletemp/newsaletempdetail',payload).subscribe((res:any)=>{
        this.fetchdatasaletempdetail()
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
  async removesaletempdetail(id:number){
   /* console.log(id)
    return */
     try{
      const button = await Swal.fire({
        title:'ยกเลิกรายการ',
        text:'คุณต้องการยกเลิกใช่หริอไม่',
        icon:'question',
        showCancelButton:true,
        showConfirmButton:true
      })
      
      if(button.isConfirmed){
        this.http.delete(config.apiServer + '/api/saletemp/removesaletempdetail/' + id).subscribe((res:any)=>{
          this.fetchdatasaletempdetail()
          this.fetchdatasaletemp()
        })
      }
    }catch(e:any){
      await Swal.fire({
        title:'error',
        text:e.message,
        icon:'error'
      })
    }
  }
  async endsale(){
    try{
      const payload = {
        userid:this.userId,
        inputmoney : this.inputmoney,
        amount : this.amount,
        returnmoney :this.returnmoney,
        paytype : this.paytype,
        tableno : this.tableno
      }
      this.http.post(config.apiServer + '/api/saletemp/endsale',payload).subscribe((res:any)=>{
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
}
  
