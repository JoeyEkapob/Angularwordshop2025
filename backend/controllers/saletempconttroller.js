const { error } = require('console');
const pool = require('./config/db');

module.exports = {
    create:async (req,res)=>{
        try{

            const sql = `SELECT * FROM Food WHERE id = ?`
            const values = [req.body.foodid]
            const [row] = await pool.query(sql,values)
          
            const sql2 = `INSERT INTO SaleTemp (foodid, qty, price ,userid,tableno) VALUES (?, ?, ?,?,?)`
            const values2 = [req.body.foodid,req.body.qty,row[0].price,req.body.userid,req.body.tableno]

            const [rows]= await pool.query(sql2,values2)
          
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
    }
}
