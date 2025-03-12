const pool = require('./config/db');

module.exports = {
    create: async (req, res) => {
        try {


            const sql = `INSERT INTO Food (foodtypeid, name, remark, price , foodtype, img , status ) VALUES (?, ?, ?,?,?,?,?) `
            const values = [parseInt(req.body.foodtypeid), req.body.name, req.body.remark, req.body.price, req.body.foodtype, req.body.img, "use"];

            const [rows] = await pool.query(sql, values)
            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    upload: async (req, res) => {
        try {

             /* return console.log(req.files.img) */
            if (req.files.img !== undefined) {
                const img = req.files.img;
                const filename = img.name

                img.mv("uploads/" + filename, (err) => {
                    if (err) {
                        res.send({ error: err })
                    }
                })
                return res.send({ filename: filename })
            } else {
                return res.send({ message: 'file not found' })
            }

        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
     list: async (req, res) => {
        try {
            const sql = `SELECT Food.*, FoodType.name AS food_type_name FROM Food LEFT JOIN FoodType ON Food.foodtypeid = FoodType.id WHERE Food.status = 'use' ORDER BY Food.id DESC`
            const [rows] = await pool.query(sql)
            return res.send({ result: rows })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    remove:async (req,res)=>{
        try{
            const sql  = `UPDATE Food SET status = ?  WHERE id = ?`;
            const values  = ['delete',parseInt(req.params.id)]
            const [rows] = await pool.query(sql,values)
            return res.send({message:'success'})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    update:async (req,res)=>{
     
       
     try{
         /*  let img = req.body.img;
            console.log(req) */
           const img = req.body.img;
           /*  if(img === ''){
                const row = `SELECT * FROM Food WHERE id = ?`
                const values = [req.body.id]
                const [rows] = await pool.query(row,values)

                img = rows.img
            } 
           const sql  = `UPDATE Food SET foodtypeid = ? , foodtype = ? , name = ? , price = ? , remark = ? , img = ?  WHERE id = ?`;
            const values  = [req.body.foodtypeid,req.body.foodtype,req.body.name,req.body.price,req.body.remark ,req.body.img ?? '',req.body.id]
            const [rows] = await pool.query(sql,values)  */
            return res.send({message:req.body.img})

        }catch(e){
            return res.status(500).send({error:e.message})
        } 
    },
    update2:async (req,res)=>{
        try{
            let img = req.body.img;

            if(img === undefined){
                const row = `SELECT img FROM Food WHERE id = ?`
                const values = [req.body.id]
                const [rows] = await pool.query(row,values)
       
                img = rows.img
              
        }
        const sql  = `UPDATE Food SET foodtypeid = ? , foodtype = ? , name = ? , price = ? , remark = ? , img = ?  WHERE id = ?`;
        const values  = [req.body.foodtypeid,req.body.foodtype,req.body.name,req.body.price,req.body.remark ,req.body.img ?? '',req.body.id]
        const [rows] = await pool.query(sql,values) 

        return res.send({message:'success'})

        } catch(e){
            return res.status(500).send({error:e.message})

        }
    

    },
    filter : async (req,res)=>{
        try{
            /* console.log(req.body.foodtype)
            return */
            const sql = `SELECT * FROM Food WHERE foodtype = ? AND status = ? ORDER BY id DESC`;
            const values = [req.body.foodtype,'use']
            const [rows] = await pool.query(sql,values) 

           /*  console.log(values) */

            return res.send({result:rows})

        } catch(e){
            return res.status(500).send({error:e.message})
                
        }
    }
}