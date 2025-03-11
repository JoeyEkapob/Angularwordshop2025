const pool = require('./config/db');


module.exports = {
    list:async(req,res)=>{
        try{
            const sql = `
                            SELECT b.*, d.*
                            FROM billSale b
                            LEFT JOIN BillSaleDetails d ON b.id = d.billSaleId
                            WHERE b.createdate BETWEEN ? AND ?
                            AND b.status = 'use'
                            ORDER BY b.createdDate DESC;
                            `;

            const billsale =  pool.query(sql, [req.body.startDate, req.body.endDate], (err, results) => {
                if (err) throw err;
                console.log(results);
                });

            return res.send({ results : billsale })
        }catch(e){
            return res.status(500).json({error:e.message})
        }
    }
}