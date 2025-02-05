const pool = require('./config/db');

module.exports = {
    create: async (req, res) => {
        try {
            const sql = `INSERT INTO FoodSize (name, remark, moneyadded, foodtypeid ) VALUES (?, ?, ?,?) `
            const values = [req.body.name, req.body.remark ?? "", req.body.price, parseInt(req.body.foodtypeid)];


            const [res1] = await pool.query(sql, values);

            return res.send({ message: "success" })

        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    list: async (req, res) => {
        try {
            const sql = `SELECT 
                                FoodSize.*, 
                                FoodType.name AS food_type_name
                            FROM FoodSize
                            LEFT JOIN FoodType ON FoodSize.foodtypeid = FoodType.id
                            WHERE FoodSize.status = 'use'
                            ORDER BY FoodSize.id DESC; ;`;
            const [rows] = await pool.query(sql)

            return res.send({ result: rows })

        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    remove:async(req,res)=>{
        try{
            const sql = `UPDATE FoodSize SET status = ?  WHERE id = ?`;
            const values = ['delete',parseInt(req.params.id)]

            const [rows] = await pool.query(sql, values)
            return res.send({message:'success'})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    update : async (req,res)=>{
        try{
            const sql = `UPDATE FoodSize SET name = ? , remark = ? , foodtypeid = ? , moneyadded = ? WHERE id = ?`;
            const values = [req.body.name, req.body.remark, req.body.foodtypeid,req.body.price,req.body.id]
            const [rows] = await pool.query(sql, values)

            return res.send({message:"success"})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    }
}