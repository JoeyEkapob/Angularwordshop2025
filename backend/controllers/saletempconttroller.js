const { error } = require('console');
const pool = require('./config/db');
const { updateSourceFile } = require('typescript');

module.exports = {
    create: async (req, res) => {
        try {

            const sql = `SELECT * FROM Food WHERE id = ?`
            const values = [req.body.foodid]
            const [row] = await pool.query(sql, values)

            const olddata = `SELECT * FROM SaleTemp WHERE foodid = ?`
            const valuesolddata = [req.body.foodid]
            const [olddatasql] = await pool.query(olddata, valuesolddata)



            /*   console.log(olddatasql[0].qty + 1)
               console.log(olddatasql[0].id)
               return  */

            if (olddatasql == '') {
                const sql2 = `INSERT INTO SaleTemp (foodid, qty, price ,userid,tableno) VALUES (?, ?, ?,?,?)`
                const values2 = [req.body.foodid, req.body.qty, row[0].price, req.body.userid, req.body.tableno]

                const [rows] = await pool.query(sql2, values2)
            } else {
                const sql2 = `UPDATE SaleTemp SET qty = ? WHERE id = ?`
                const values2 = [olddatasql[0].qty + 1, olddatasql[0].id]

                const [rows2] = await pool.query(sql2, values2)
                /*  console.log(values2) */
            }

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    list: async (req, res) => {
        try {
            /*  console.log(req.body.userId)
             return */
            const sql = `SELECT 
                        SaleTemp.id as saletemp_id,
                        SaleTemp.*, 
                        Food.*, 
                        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'foodid', foodid, 'saletempid', saletempid,'addedmoney',addedmoney,'tasteid',tasteid,'foodid',foodid)) 
                        FROM SaleTempDetail 
                        WHERE SaleTempDetail.saletempid = SaleTemp.id) AS saletempdetail
                    FROM SaleTemp 
                    LEFT JOIN Food ON SaleTemp.foodid = Food.id 
                    WHERE SaleTemp.userid = ? 
                    ORDER BY SaleTemp.id DESC`
            const values = [req.body.userId]
            const [row] = await pool.query(sql, values)
            /* console.log(row) 
            return  */
            return res.send({ results: row })
        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    clear: async (req, res) => {
        try {
            const sql = 'DELETE FROM SaleTemp WHERE userId = ?'
            const values = [req.params.userId]
            const [row] = await pool.query(sql, values)

            return res.send({ message: 'success' })

        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    remove: async (req, res) => {
        /* console.log(req.params.foodid)
         console.log(req.params.userid)
         return */
        try {

            const sql = `SELECT 
                        SaleTemp.*, 
                        JSON_ARRAYAGG(SaleTempDetail.id) AS detail_ids
                        FROM SaleTemp
                        LEFT JOIN SaleTempDetail ON SaleTempDetail.saletempid = SaleTemp.id
                        WHERE SaleTemp.foodid = ? 
                        AND SaleTemp.userid = ?
 `
            const [rows] = await pool.query(sql, [req.params.foodid, req.params.userid])

            /*  console.log(rows.length)
                return  */

            const arr = JSON.parse(rows[0].detail_ids);
            /*  console.log(arr)
             return  */
            for (let i = 0; i < arr.length; i++) {

                if (rows.length > 0) {

                    const saletempid = arr[i]

                    const sql2 = `DELETE FROM SaleTempDetail WHERE id = ?  `
                    await pool.query(sql2, [saletempid])
                }
            }

            const sql3 = `DELETE FROM SaleTemp WHERE foodid = ? AND userid = ?`
            await pool.query(sql3, [req.params.foodid, req.params.userid])


            return res.send({ message: 'success' })

        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    changeqty: async (req, res) => {
        /*   const olddata = `SELECT * FROM SaleTemp WHERE foodid = ?`
          const valuesolddata = [req.body.id]
          const [olddatasql] = await pool.query(olddata,valuesolddata)
  
          let oldqty = olddatasql[0].qty
  
          console.log(oldqty)
          return */
        try {
            const olddata = `SELECT * FROM SaleTemp WHERE foodid = ?`
            const valuesolddata = [req.body.id]
            const [olddatasql] = await pool.query(olddata, valuesolddata)

            let oldqty = olddatasql[0].qty

            /*    console.log(oldqty)
               return */
            if (req.body.style == "down") {
                oldqty = oldqty - 1
                if (oldqty < 0) {
                    oldqty = 0
                }
            } else {
                oldqty = oldqty + 1
            }
            /*  console.log(oldqty)
             return */
            const sql = `UPDATE SaleTemp SET qty = ? WHERE foodid = ?`
            const values = [oldqty, req.body.id]
            const [row] = await pool.query(sql, values)

            /*  console.log(values)
 
             return */

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    createDetail: async (req, res) => {
        try {
            const qty = req.body.qty
            const foodid = req.body.foodid
            const saletempid = req.body.saletempid


            const sql = `SELECT * FROM SaleTempDetail WHERE foodid = ? AND saletempid = ? `
            const values = [foodid, saletempid]
            const [olddata] = await pool.query(sql, values)

            /*    console.log(olddata)
   
               return */

            if (olddata.length < qty) {

                const sql2 = `INSERT INTO SaleTempDetail (foodid,saletempid) VALUES (?, ?)`
                for (let i = 0; i < qty; i++) {
                    await pool.query(sql2, [foodid, saletempid])
                }
            }


            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    listsaletempdetail: async (req, res) => {
        try {
            const sql = `SELECT std.*, f.name AS food_name,  f.price AS food_price  FROM SaleTempDetail AS std JOIN Food AS f ON std.foodid = f.id 
                                WHERE std.saletempid = ? ORDER BY std.id ASC;`
            const [rows] = await pool.query(sql, [parseInt(req.body.saletempid)])
            /*       console.log(rows)
                  return res.send({ result: rows }) */
            /*   return  */

            const arr = []

            for (let i = 0; i < rows.length; i++) {

                const item = rows[i]
                /*  console.log(item)
             } */
                if (item.tasteid != null) {
                    const sql2 = `SELECT * FROM Taste WHERE id = ? LIMIT 1`
                    const [rows2] = await pool.query(sql2, [item.tasteid])
                    /*    console.log( rows2[0].name) */

                    item.tastename = rows2[0].name
                }

                arr.push(item)
            }


            /*  console.log(arr)  
             return */
            return res.send({ result: arr })

        } catch (e) {

            return res.status(500).send({ error: e.message })
        }
    },
    updateFoodsize: async (req, res) => {

        try {
            const sql = `SELECT * FROM FoodSize WHERE id = ?  LIMIT 1`
            const [row] = await pool.query(sql, [req.body.foodsizeid])
            /*   console.log(req.body.foodsizeid)
              console.log(req.body.saletempid)
             
              return  */

            const sql2 = `UPDATE SaleTempDetail SET addedmoney = ? WHERE id = ?`
            await pool.query(sql2, [row[0].moneyadded, req.body.saletempid]);



            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    updatetaste: async (req, res) => {
        try {
            const sql = `UPDATE SaleTempDetail SET tasteid = ? WHERE id = ? `
            /*  console.log(sql)
             console.log(req.body.tasteid)
             console.log(req.body.saletempid)
          return */
            const values = [req.body.tasteid, req.body.saletempid]
            const [rows] = await pool.query(sql, values)
            /* console.log(rows)
            return  */
            return res.send({ message: 'success' })

        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    newsaletempdetail: async (req, res) => {
        try {
            const sql = `INSERT INTO  SaleTempDetail (saletempdetail,foodid) VALUES (?,?)`
            await pool.query(sql, [req.body.saletempid, req.body.foodid])
            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    removesaletempdetail: async (req, res) => {
        try {
            const sql = `DELETE FROM SaleTempDetail WHERE id = ?  `
            await pool.query(sql, parseInt(req.params.id))

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },

    endsale: async (req, res) => {

        /*  console.log(req.body.userid)
            return  */
        try {
            const sql = `SELECT 
                        SaleTemp.*, 
                         JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', SaleTempDetail.id,
                                'saletempid', SaleTempDetail.saletempid,
                                'foodid', SaleTempDetail.foodid,
                                'addedmoney', SaleTempDetail.addedmoney,
                                'tasteid', SaleTempDetail.tasteid
                            )
                        ) AS SaleTempDetail,
                         Food.*
                        FROM SaleTemp
                        LEFT JOIN SaleTempDetail ON SaleTempDetail.saletempid = SaleTemp.id
                        LEFT JOIN Food ON Food.id = SaleTempDetail.foodid
                       

                        WHERE SaleTemp.userid = ?`
            const [rows] = await pool.query(sql, parseInt(req.body.userid))

           const sqlbillsale = `INSERT INTO BillSale (amount,inputmoney,paytype,tableno,userid,returnmoney) VALUES(?,?,?,?,?,?) `
             const values = [req.body.amount, req.body.inputmoney,req.body.paytype,req.body.tableno,req.body.userid,req.body.returnmoney]
             const [billsale] =   await pool.query(sqlbillsale,values)
 
             const sqlGetBill = `SELECT * FROM BillSale WHERE id = ?`;
             const [newBill] = await pool.query(sqlGetBill, [billsale.insertId]); 

            /*  console.log(billsale[0].userid)
               return  */
            for(let i =0;i < rows.length;i++){
                    const  item = JSON.parse(rows[i].SaleTempDetail)
                
                    if(item.length > 0){
                        for( let j = 0; j< item.length;j++ ){
                            const detail = item[j]
                         const sqlBillSaleDetail = `INSERT INTO BillSaleDetail (billsaleid,foodid,tasteid,moneyadded,price) VALUES(?,?,?,?,?) `
                         await pool.query(sqlBillSaleDetail, [newBill[0].id, detail.foodid , detail.tasteid  , detail.addedmoney ,detail.price])
                        }
                    }else{
                        const sqlBillSaleDetail = `INSERT INTO BillSaleDetail (billsaleid,foodid,price) VALUES(?,?,?) `
                        await pool.query(sqlBillSaleDetail, [newBill[0].id,item.foodid ,item.food.price])
                    } 
    
    
             
                }  
            const item = JSON.parse(rows[0].SaleTempDetail)
            for (let j = 0; j < item.length; j++) {

           /*      console.log(item.length) */
                for (let j = 0; j < item.length; j++) {

                    const sql = `DELETE FROM SaleTempDetail WHERE id = ?  `
                    await pool.query(sql, [parseInt(item[j].id)])
                }
            }



            const sql2 = `DELETE FROM SaleTemp WHERE userid = ?  `
            await pool.query(sql2, [req.body.userid])


            return res.send({ message: 'success' })


        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    }
}
