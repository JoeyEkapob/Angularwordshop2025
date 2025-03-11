
const pool = require('./config/db');

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
            return   */ 
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
          /*   console.log(rows[0])
            return */

           const sqlbillsale = `INSERT INTO BillSale (amount,inputmoney,paytype,tableno,userid,returnmoney) VALUES(?,?,?,?,?,?) `
             const values = [req.body.amount, req.body.inputmoney,req.body.paytype,req.body.tableno,req.body.userid,req.body.returnmoney]
             const [billsale] =   await pool.query(sqlbillsale,values)
          
             const sqlGetBill = `SELECT * FROM BillSale WHERE id = ?`;
             const [newBill] = await pool.query(sqlGetBill, [billsale.insertId]); 

            /*  const  item2 = JSON.parse(rows[0].SaleTempDetail) */
           
        /*     console.log(item2[1]) */ 
           /*   item2.map((item,index)=>{ */
              /*  console.log(item.id) */
             /*   if(item.id){
                console.log(item2.length)
               } */
               /*  if(item[item].id){
                    console.log('trujjn')

                } */
           /*   }) */
          /*    return  */
            for(let i =0;i < rows.length;i++){
                    const  item = JSON.parse(rows[i].SaleTempDetail)
                
                    if(item.length > 0 ){
                    
                       
                         for( let j = 0; j< item.length;j++ ){
                            const detail = item[j]
                           

                            if(detail.id){
                                
                               const sqlBillSaleDetail = `INSERT INTO BillSaleDetail (billsaleid,foodid,tasteid,moneyadded,price) VALUES(?,?,?,?,?) `
                                 await pool.query(sqlBillSaleDetail, [newBill[0].id, detail.foodid , detail.tasteid  , detail.addedmoney ,detail.price])
                               /*   console.log('true') */
                            /* }else{
                                console.log(newBill[0].id)
                                console.log(rows[0].foodid)
                                console.log(item.food.price)

                                /* const sqlBillSaleDetail = `INSERT INTO BillSaleDetail (billsaleid,foodid,price) VALUES(?,?,?) `
                                await pool.query(sqlBillSaleDetail, [newBill[0].id,item.foodid ,item.food.price])
                                console.log('false') 
                            } */
                         /*  */
                        } 
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
    },
    printbillbeforepay :async (req,res)=>{
        try{
            const sql = `SELECT * FROM Orgnization LIMIT 1 `
            const [organization] = await pool.query(sql)

            const sql2 = `SELECT 
                                 s.*,
                                    JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            'id', d.id,
                                            'saletempid', d.saletempid,
                                            'addedmoney', d.addedmoney,
                                            'tasteid', d.tasteid,
                                            'foodid', d.foodid
                                        )
                                    ) AS SaleTempDetails,
                                    JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            'id', f.id,
                                            'foodtypeid', f.foodtypeid,
                                            'name', f.name,
                                            'remark', f.remark,
                                            'price', f.price,
                                            'img', f.img,
                                            'foodtype', f.foodtype,
                                            'status', f.status
                                        )
                                    ) AS Food
                            FROM SaleTemp s
                            LEFT JOIN Food f ON f.id = s.foodId
                            LEFT JOIN SaleTempDetail d ON s.id = d.saleTempId
                         
                            WHERE s.userId = ? AND s.tableNo = ?`

                        /* const sql2 = `SELECT s.*,f.*,d.*FROM SaleTemp s 
                        LEFT JOIN Food f ON f.id = s.foodId 
                        LEFT JOIN SaleTempDetail d ON s.id = d.saleTempId 
                        WHERE s.userId = ? AND s.tableNo = ?` */

            const values = [req.body.userid,req.body.tableno]
          
            const [SaleTemp] = await pool.query(sql2,values)

    /*     console.log(SaleTemp) 
        return */

          const saleTempDetails = JSON.parse(SaleTemp[0].SaleTempDetails);
          const foodList = JSON.parse(SaleTemp[0].Food);

          console.log(saleTempDetails) 

          
          const foodMap = foodList.reduce((acc, food) => {
            const totalQty = saleTempDetails.filter(detail => detail.foodid === food.id).length;
            const result = totalQty === 0 ? SaleTemp[0].qty : totalQty;
            if(!acc[food.id]){
                acc[food.id] = {
                tableNo: SaleTemp[0].tableno,
                userId: SaleTemp[0].userid,
                foodName: food.name,
                price: food.price,
                qty: result,
                totalPrice: food.price * result
            }
    
             }  
                /*    return totalQty */
            return acc
          }, {})    

     /*      console.log(foodMap)
          return */

/* 
          ret
            let sumamount5 = 0;

               


          console.log(result)
        return
          */


        const pdfkit = require('pdfkit')
            const fs = require('fs')
            const dayjs = require('dayjs');

            const paperWidth = 80
            const padding = 3;

            const doc = new pdfkit({
                size:[paperWidth,200],
                margins:{
                    top:3,
                    bottom:3,
                    left:3,
                    right:3,
                }
            })
            const filename = `uploads/bill-${dayjs(new Date()).format('YYYYMMDDHHmmss')}.pdf`;
            const font = 'Kanit/Kanit-Regular.ttf'

            doc.pipe(fs.createWriteStream(filename))

            const imageWidth = 20;
            const positionX = (paperWidth / 2) - (imageWidth / 2 )

            doc.image('uploads/'+ organization[0].logo , positionX,5,{
                align:'center',
                width:imageWidth,
                height:20
            })
            doc.moveDown()

            doc.font(font)
            doc.fontSize(5).text('***ใบแจ้งรายการ***',20,doc.y+8)
            doc.fontSize(8)
            doc.text(organization[0].name, padding,doc.y + 8)
            doc.fontSize(5)
            doc.text(organization[0].address)
            doc.text(`เบอร์โทร: ${organization[0].phone}`)
            doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization[0].taxcode}`)
            doc.text(`โต๊ะ: ${req.body.tableno}`,{align:'center'})
            doc.text(`วันที่: ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`,{align:'center'})
            doc.text('รายการอาหาร',{align:'center'})
            doc.moveDown();

            const y = doc.y;
            doc.fontSize(4)
            doc.text('รายการ',padding , y)
            doc.text('ราคา',padding + 18  , y,{align:'right',width:20})
            doc.text('จำนวน',padding + 36  , y,{align:'right',width:20})
            doc.text('รวม',padding + 55  , y,{align:'right'})

            doc.lineWidth(0.1)
            doc.moveTo(padding,y+6).lineTo(paperWidth - padding,y+6).stroke()
            Object.values(foodMap).map((item,index)=>{
                
                const y = doc.y;    
                    doc.text(item.foodName, padding, y);
                    doc.text(item.price, padding + 18, y, { align: 'right', width: 20 });
                    doc.text(item.qty, padding + 36, y, { align: 'right', width: 20 });
                    doc.text((item.totalPrice).toString(), padding + 55, y, { align: 'right' });
            
            
              
            })

            const resulttotal = Object.values(foodMap).reduce((acc,item)=> acc + item.totalPrice , 0 )
            const  resulttotaldetails = saleTempDetails.reduce((acc,item)=> acc + item.addedmoney , 0)
            const totalall = resulttotal + resulttotaldetails ?? 0

            doc.text(`รวม: ${totalall} บาท`,{align:'center'})
            doc.end()

            return res.send({message : 'success',filename:filename})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    printbillafterpay : async (req,res)=>{
        try{
            const sql = `SELECT * FROM Orgnization LIMIT 1 `
            const [organization] = await pool.query(sql)

            const sql2 = `SELECT b.*,bd.*,f.*,u.*
                               
                            FROM BillSale b
                            LEFT JOIN BillSaleDetail bd ON b.id = bd.billsaleid
                            LEFT JOIN Food f ON bd.foodid = f.id
                            LEFT JOIN users u ON b.userid = u.id
                         
                            WHERE b.userid = ? AND b.tableno = ? AND b.status = 'use' ORDER BY b.id DESC LIMIT 1`

                        /* const sql2 = `SELECT s.*,f.*,d.*FROM SaleTemp s 
                        LEFT JOIN Food f ON f.id = s.foodId 
                        LEFT JOIN SaleTempDetail d ON s.id = d.saleTempId 
                        WHERE s.userId = ? AND s.tableNo = ?` */

            const values = [req.body.userid,req.body.tableno]
          
            const [billsale] = await pool.query(sql2,values)

 /*      console.log(billsale)  */
      /* billsale.map((item,index)=>{
      
        const y = doc.y;    
            doc.text(item.amount, padding, y);
            doc.text(item.price, padding + 18, y, { align: 'right', width: 20 });
            doc.text(item.qty, padding + 36, y, { align: 'right', width: 20 });
            doc.text((item.totalPrice).toString(), padding + 55, y, { align: 'right' });
    
    
      
    }) */
    

        /*   const saleTempDetails = JSON.parse(SaleTemp[0].SaleTempDetails);
          const foodList = JSON.parse(SaleTemp[0].Food);

          console.log(saleTempDetails) 

          
          const foodMap = foodList.reduce((acc, food) => {
            const totalQty = saleTempDetails.filter(detail => detail.foodid === food.id).length;
            const result = totalQty === 0 ? SaleTemp[0].qty : totalQty;
            if(!acc[food.id]){
                acc[food.id] = {
                tableNo: SaleTemp[0].tableno,
                userId: SaleTemp[0].userid,
                foodName: food.name,
                price: food.price,
                qty: result,
                totalPrice: food.price * result
            }
    
             }  
          
            return acc
          }, {})     */

     /*      console.log(foodMap)
          return */

/* 
          ret
            let sumamount5 = 0;

               


          console.log(result)
        return
          */


        const pdfkit = require('pdfkit')
            const fs = require('fs')
            const dayjs = require('dayjs');

            const paperWidth = 80
            const padding = 3;

            const doc = new pdfkit({
                size:[paperWidth,200],
                margins:{
                    top:3,
                    bottom:3,
                    left:3,
                    right:3,
                }
            })
            const filename = `uploads/invoice-${dayjs(new Date()).format('YYYYMMDDHHmmss')}.pdf`;
            const font = 'Kanit/Kanit-Regular.ttf'

            doc.pipe(fs.createWriteStream(filename))

            const imageWidth = 20;
            const positionX = (paperWidth / 2) - (imageWidth / 2 )

            doc.image('uploads/'+ organization[0].logo , positionX,5,{
                align:'center',
                width:imageWidth,
                height:20
            })
            doc.moveDown()

            doc.font(font)
            doc.fontSize(5).text('***ใบเสร็จรับเงิน***',20,doc.y+8)
            doc.fontSize(8)
            doc.text(organization[0].name, padding,doc.y + 8)
            doc.fontSize(5)
            doc.text(organization[0].address)
            doc.text(`เบอร์โทร: ${organization[0].phone}`)
            doc.text(`เลขประจำตัวผู้เสียภาษี: ${organization[0].taxcode}`)
            doc.text(`โต๊ะ: ${req.body.tableno}`,{align:'center'})
            doc.text(`วันที่: ${dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss')}`,{align:'center'})
            doc.text('รายการอาหาร',{align:'center'})
            doc.moveDown();

            const y = doc.y;
            doc.fontSize(4)
           
            doc.text('รายการ',padding , y)
            doc.text('ราคา',padding + 18  , y,{align:'right',width:20})
            doc.text('จำนวน',padding + 36  , y,{align:'right',width:20})
            doc.text('รวม',padding + 55  , y,{align:'right'})
           

            doc.lineWidth(0.1)
            doc.moveTo(padding,y+6).lineTo(paperWidth - padding,y+6).stroke()
         
            billsale.map((item,index)=>{
                doc.moveDown();
                doc.text(`รวม: ${item.amount} บาท รับเงิน: ${item.inputmoney}`,padding  ,y +10 ,{align:'center'})
                doc.text(`เงินทอน: ${item.amount} บาท`,{align:'center'})
       
            
              
            })

        /*     const resulttotal = Object.values(foodMap).reduce((acc,item)=> acc + item.totalPrice , 0 )
            const  resulttotaldetails = saleTempDetails.reduce((acc,item)=> acc + item.addedmoney , 0)
            const totalall = resulttotal + resulttotaldetails ?? 0

            doc.text(`รวม: ${totalall} บาท`,{align:'center'}) */
            doc.end()

            return res.send({message : 'success',filename:filename})    
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    }
}
