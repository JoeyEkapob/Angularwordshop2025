const { error } = require('console');
const pool = require('./config/db');
const { remove } = require('./foodtypecontroller');


module.exports = {
    list:async(req,res)=>{
        try{
   /*    console.log(req.body.startdate) */
           /*  console.log(typeof(req.body.enddate))
            return   */ 
         const startDate = new Date(req.body.startdate)
                .toISOString()
                .slice(0, 19)
               

                const endDate = new Date(req.body.enddate)
                .toISOString()
                .slice(0, 19)
               
              /*   console.log(startDate)
                console.log(endDate)
           /*      console.log(typeof(endDate)) */ 
          /*     return  */
                
            const sql = `
                           SELECT b.* ,b.id as billsid  ,u.* ,JSON_ARRAYAGG(
                                                JSON_OBJECT(
                                                'id',d.id,
                                                'billsaleid',d.billsaleid,
                                                'foodid',d.foodid,
                                                'foodsizeid',d.foodsizeid,
                                                'tasteid',d.tasteid,
                                                'moneyadded',d.moneyadded,
                                                'price',d.price
                                                )
                                            ) as BillSaleDetail                          
                            FROM BillSale b
                            LEFT JOIN BillSaleDetail d ON b.id = d.billsaleid
                            LEFT JOIN users u ON b.userid = u.id
                            WHERE b.createdate BETWEEN ? AND ?
                            AND b.status = 'use'
                            GROUP BY b.id, u.id
                            ORDER BY b.createdate DESC;
                            `;
                            

            const [billsale] = await pool.query(sql, [startDate, endDate], (err, results) => {
                if (err) throw err;
                console.log(results);
                });
              /*  console.log(billsale)
               return  */

            return res.send({ results : billsale })
        }catch(e){
            return res.status(500).json({error:e.message})
        }
    },
    remove: async (req,res) => {
        try{
           /*  console.log(req.params.id)
            return */
            const sql = `UPDATE BillSale SET status = 'delete'  WHERE id = ?`
            await pool.query(sql,[parseInt(req.params.id)])

            return res.send({results:'success'})
        }catch(e){
            return res.status(500).json({error:e.message})
        }
    }
}