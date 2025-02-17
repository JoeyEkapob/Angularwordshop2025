const { error } = require('console');
const pool = require('./config/db');

module.exports = {
    create:async (req,res)=>{
        try{

            const sql = `SELECT * FROM Food WHERE id = ?`
            const values = [req.body.foodid]
            const [row] = await pool.query(sql,values)

            const olddata = `SELECT * FROM SaleTemp WHERE foodid = ?`
            const valuesolddata = [req.body.foodid]
            const [olddatasql] = await pool.query(olddata,valuesolddata)

         
     
     /*   console.log(olddatasql[0].qty + 1)
        console.log(olddatasql[0].id)
        return  */
          
             if(olddatasql == ''){
                const sql2 = `INSERT INTO SaleTemp (foodid, qty, price ,userid,tableno) VALUES (?, ?, ?,?,?)`
                const values2 = [req.body.foodid,req.body.qty,row[0].price,req.body.userid,req.body.tableno]
    
                const [rows]= await pool.query(sql2,values2)
            }else{
                const sql2 = `UPDATE SaleTemp SET qty = ? WHERE id = ?`
                const values2 = [olddatasql[0].qty + 1 , olddatasql[0].id]
    
                const [rows2]= await pool.query(sql2,values2)
               /*  console.log(values2) */
            } 
          
            return res.send({message:'success'})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    list:async (req,res)=>{
        try{
           /*  console.log(req.body.userId)
            return */
            const sql = `SELECT  SaleTemp.*,Food.* FROM SaleTemp LEFT JOIN Food ON SaleTemp.foodid = Food.id WHERE userid = ? ORDER BY SaleTemp.id DESC `
            const values = [req.body.userId]
            const [row] = await pool.query(sql,values)
            /* console.log(req.body.userId) */
            return res.send({results:row})
        }catch(e){
            return  res.status(500).send({error:e.message})

        }
    },
    clear:async(req,res)=>{
        try{
            const sql = 'DELETE FROM SaleTemp WHERE userId = ?'
            const values = [req.params.userId]
            const [row] = await pool.query(sql,values)

            return res.send({message:'success'})
            
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    remove:async(req,res)=>{
        try{
            const sql = `DELETE FROM SaleTemp WHERE foodid = ? AND userid = ? `
            const values = [req.params.foodid,req.params.userid]

            const [row] = await pool.query(sql,values)
            return res.send({message:'success'})

        }catch(e){
            return res.status(500).send({error:e.message})

        }
    },
    changeqty : async (req,res)=>{
      /*   const olddata = `SELECT * FROM SaleTemp WHERE foodid = ?`
        const valuesolddata = [req.body.id]
        const [olddatasql] = await pool.query(olddata,valuesolddata)

        let oldqty = olddatasql[0].qty

        console.log(oldqty)
        return */
        try{
            const olddata = `SELECT * FROM SaleTemp WHERE foodid = ?`
            const valuesolddata = [req.body.id]
            const [olddatasql] = await pool.query(olddata,valuesolddata)

            let oldqty = olddatasql[0].qty

         /*    console.log(oldqty)
            return */
            if(req.body.style == "down"){
                oldqty = oldqty - 1
                if(oldqty < 0){
                    oldqty = 0
                }
            }else{
                oldqty = oldqty + 1
            }
           /*  console.log(oldqty)
            return */
            const sql = `UPDATE SaleTemp SET qty = ? WHERE foodid = ?`
            const values = [oldqty,req.body.id]
            const [row] = await pool.query(sql,values)

           /*  console.log(values)

            return */

            return res.send({message:'success'})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    
    
}
