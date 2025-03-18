const dayjs = require('dayjs')
const pool = require('./config/db')
const { error } = require('console')
/*  const utc = require('dayjs/plugin/utc');  
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);  */

module.exports = {
    sumperdayinyearandmonth :async (req,res)=>{
        try{
            const year = req.body.year
            const month = req.body.month

          /*   const bangkokTime = dayjs().tz('Asia/Bangkok').format();
            console.log('Bangkok Time:', bangkokTime);
            return */
            const sumperday = []
            const startdate = dayjs(`${year}-${month}-01`);
            const enddate = startdate.endOf('month') 
          /*   console.log(year)
            console.log(month)
            console.log(sumperday)
            console.log(startdate) 
           console.log(startdate)  */
          /*   console.log(enddate.format())   */
          /*   return

            return */
            for(let day = startdate.date();day<=enddate.date();day++){
            /*  console.log(day)  */
                
             const dateFrom = startdate.date(day).format('YYYY-MM-DD')
             const dateto = startdate.date(day).add(1,'day').format('YYYY-MM-DD')
           

               const sql = `SELECT b.*,    
                                        JSON_ARRAYAGG(
                                            JSON_OBJECT(
                                                'id', d.id,
                                                'billsaleid', d.billsaleid,
                                                'foodid', d.foodid,
                                                'foodsizeid', d.foodsizeid,
                                                'tasteid', d.tasteid,
                                                'moneyadded', d.moneyadded,
                                                'price', d.price
                                            )
                                        ) AS BillSaleDetail
                                FROM BillSale b
                                LEFT JOIN BillSaleDetail d ON b.id = d.billsaleid
                                WHERE b.createdate = ? 
                                AND b.status = 'use'
                                `

                const [billsale] = await pool.query(sql,[dateFrom])
                
             /*    console.log(billsale) */
               
                
              let sum = 0
              for(let i = 0; i < billsale.length ; i++){
                    sum  += billsale[i].amount ?? 0
              }
            
                /*  if(billsaledetails ){
                    const  jsonbillsaledetails = JSON.parse(billsaledetails) 
                  
                    for(let j = 0;j<jsonbillsaledetails.length;j++){
                    
                      sum += jsonbillsaledetails[j].moneyadded ?? 0 

                    } */
                   
              /*    } */
                 
              /*   }  */
           /*   sumperday.push({
                    date:dateFrom, 
                    amount:billsale[0].amount ?? 0
                })  
      */
              
           /*  const billsaledetails = JSON.parse(billsale[0].BillSaleDetail)
            const foodMap = foodList.reduce((acc, food) => {
                let sum = billsaledetails
                .filter(item => item.foodid === food.id) // เลือกเฉพาะที่ foodid ตรงกัน
                .reduce((total, item) => total + (item.moneyadded || 0), 0); // บวก moneyadded
        
            const totalQty = billsaledetails.filter(detail => detail.foodid === food.id).length;
               const result = totalQty === 0 ? billsale[0].qty : totalQty;  
               if(!acc[food.id]){
                
                    acc[food.id] = {
                    tableNo: billsale[0].tableno,
                    userId: billsale[0].userid,
                    foodName: food.name,
                    price: food.price,
                    qty: totalQty,
                    totalPrice: (food.price * result) + sum
                }
        
                 }   
                
                return acc
              }, {})    */
               /*  let sum =0
              
                for(let i = 0; i < billsale.length ; i++){
                    const billsaledetails = billsale[i].BillSaleDetail
            
                 if(billsaledetails ){
                    const  jsonbillsaledetails = JSON.parse(billsaledetails) 
                   /
                    for(let j = 0;j<jsonbillsaledetails.length;j++){
                    
                      sum += jsonbillsaledetails[j].moneyadded ?? 0 

                    }
                   
                 }
                 
                } */
               sumperday.push({
                    date:dateFrom, 
                    amount:sum
                })  
     
            
            }
            
            return res.send({results :sumperday})
        }catch(e){
            return res.status(500).json({error:e.message})
        }
    },
    sumpermonthinyear :async (req,res)=>{
      try{
        const year = req.body.year
        const sumpermonth = [];

        /* console.log(year)
        return
 */
        for (let month = 1;month <=12; month++){
         


          const startdate = dayjs(`${year}-${month}-01`)
          const enddate = startdate.endOf('month')
        /*   console.log(startdate)
          console.log(enddate) */
     /*    console.log(new Date(startdate.format('YYYY-MM-DD')))
          console.log(new Date(enddate.format('YYYY-MM-DD')))  */
         
          const sql = `SELECT b.*,    
                                        JSON_ARRAYAGG(
                                            JSON_OBJECT(
                                                'id', d.id,
                                                'billsaleid', d.billsaleid,
                                                'foodid', d.foodid,
                                                'foodsizeid', d.foodsizeid,
                                                'tasteid', d.tasteid,
                                                'moneyadded', d.moneyadded,
                                                'price', d.price
                                            )
                                        ) AS BillSaleDetail
                                FROM BillSale b
                                LEFT JOIN BillSaleDetail d ON b.id = d.billsaleid
                                WHERE b.createdate BETWEEN ? AND ?
                                AND b.status = 'use'
                                `

                const [billsales] = await pool.query(sql,[ new Date(startdate.format('YYYY-MM-DD')),new Date(enddate.format('YYYY-MM-DD'))])
                /* console.log(billsales[0])  */
                let sum = 0;
                if(billsales[0].id){
                /*   console.log(billsales.length) */
                 /*  console.log(new Date(startdate.format('YYYY-MM-DD')))
                  console.log(new Date(enddate.format('YYYY-MM-DD'))) 
                  
                  sum += billsales[i].amount */
               
               
                  for(let i = 0 ; i < billsales.length;i++){
                    sum += billsales[i].amount  
              /*    console.log(billsales[i]) */
                  /*   console.log(i)   */
                  }
               /*    console.log(sum)  */
                }
       
                /*  for(let i = 0 ; i < billsales[0].length;i++){
                    sum += billsales[i].amount
                }  
                console.log(sum)  */
                /* return */ 
                /* let sum = 0;

                for(let i =0 ; i < billsales[0].length;i++){
                  const billsaledetails = billsales[i].billsaledetails

                  for(let j= 0 ;j<billsaledetails.length;j++){
                    sum += billsaledetails[j].price
                  }

                } */

                sumpermonth.push({
                  month : startdate.format('MM'),
                  amount : sum
                }) 
         
        }
       /*  console.log(sumpermonth) */
      /*  return */
        return res.send({results:sumpermonth})
      }catch(e){
        return res.status(500).json({error:e.message})
      }
    }
}
