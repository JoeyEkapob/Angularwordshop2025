const { error } = require('console');
const pool = require('./config/db');

module.exports = {
    create : async (req,res)=>{
        try{
            const sql = `INSERT INTO Taste (name, remark, foodtypeid ) VALUES (?, ?, ?) `
            const values = [req.body.name, req.body.remark ?? "", parseInt(req.body.foodtypeid)];
    
            const [rows] = pool.query(sql,values)
            res.send({message:'success'})
        }catch(e){
            res.status(500).send({error:e.message})
        }
       
    },
    list:async (req,res)=> {
        try{
            const sql = `SELECT 
                                Taste.*, 
                                FoodType.name AS food_type_name
                            FROM Taste
                            LEFT JOIN FoodType ON Taste.foodtypeid = FoodType.id
                            WHERE Taste.status = 'use'
                            ORDER BY Taste.id DESC; ;`;;
            const [rows] = await pool.query(sql)

            return res.send({ result: rows })

        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    remove:async(req,res)=>{
        try{
            const sql = `UPDATE Taste SET status = ? WHERE id = ?`
            const values = ['delete',parseInt(req.params.id)]
            const [rows] = await pool.query(sql, values)

            res.send({result:'success'})
        }catch(e){
            res.status(500).send({error:e.message})
        }
    },
    update:async(req,res)=>{
        try{
            const sql =`UPDATE Taste SET name = ? , remark = ? ,foodtypeid = ?  WHERE id = ?`
            const values = [req.body.name, req.body.remark, req.body.foodtypeid,req.body.id]
            const [rows] = await pool.query(sql, values)
            res.send({result:'success'})
        }catch(e){
            res.status(500).send({error:e.message})

        }
    },
    listbyfoodtypeid: async (req,res)=>{
        try{
            const sql = `SELECT * FROM Taste WHERE foodtypeid = ? AND status = ? ORDER BY name ASC`
            const [rows] = await pool.query(sql,[req.body.foodtypeid,'use'])
            /* console.log(rows)
            return */
            return res.send({result : rows})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    
}