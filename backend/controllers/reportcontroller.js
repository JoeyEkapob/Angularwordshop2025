const dayjs = require('dayjs')
const pool = require('./config/db')
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
                const dateFrom = startdate.date(day).format('YYYY-MM-DD')
                const dateto = startdate.date(day).add(1,'day').format('YYYY-MM-DD')

                const sql = `SELECT b.*, d.*
                                FROM BillSale b
                                LEFT JOIN BillSaleDetail d ON b.id = d.billsaleid
                                WHERE b.createdate BETWEEN ? AND ?
                                AND b.status = 'use'
                                `

                const [billsale] = await pool.query(sql,[dateFrom,dateto])

                console.log(billsale.length)


                /* let sum =0

                for(let i = 0; i < billsale.length ; i++){
                    const billsaledetails = billsale[i].billsaledetails
                    for(let j = 0;j<billsaledetails.length;j++){

                    }
                }
                sumperday.push({
                    date:dateFrom,
                    amount:sum
                }) */
            }
            return
            return res.send({results :sumperday})
        }catch(e){
            return res.status(500).json({error:e.message})
        }
    }
}
