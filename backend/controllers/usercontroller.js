const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const pool = require('./config/db');
const { error } = require("console");
const { update } = require("./foodtypecontroller");


dotenv.config();

module.exports = {
    signin: async (req,res)=>{
        try{
            const [rows] = await pool.query(
                'SELECT id,username,level FROM users WHERE username = ? AND password = ? AND status = ?',
                [req.body.username, req.body.password, 'use']
              );
     

          
              const user = rows[0]; 
           /*    console.log(user ) 
             return  */
              if(rows != null){
                const key = process.env.SECRET_KEY
                const token = jwt.sign(user,key,{expiresIn:"30d"})
            /*  console.log(user.username ,user.id) */
                return res.send({token:token, name: user.username , id : user.id})
              }
          
            return res.status(401).send({message : "unauthorized"})
        }catch(e){
            return res.status(500).send({error:e.message})
        }

    },
    list: async (req,res)=>{
        try{
            const sql = `SELECT * FROM users WHERE status = 'use' ORDER BY id DESC;
`
            const [users] = await pool.query(sql)

            return res.send({results:users})
        }catch(e){
            return res.status(500).send({error:e.message})
        }

    },
    create : async (req,res)=>{
        try{
            const sql = `INSERT INTO users 
                                (email, username, password, level) 
                                VALUES (?, ?, ?, ?)`
            const values = [req.body.username,req.body.password,req.body.name,req.body.level]
            await pool.query(sql,values)

            return res.send({message : 'success'})

        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    remove : async ( req,res)=>{
        try{
            const sql =`UPDATE users SET status = 'no' WHERE id = ?`
            await pool.query(sql,parseInt(req.params.id))

            return res.send({message:'success'})
        }catch(e){
            
            return res.status(500).send({error:e.message})

        }
    },
    update: async(req,res)=>{
        try{
            const sql =`UPDATE users SET username = ? , password = ? , email = ? , level = ? WHERE id = ?`
            const values = [ req.body.username , req.body.password , req.body.email , req.body.level , req.body.id]
          /*   console.log(values)
            return */
            await pool.query(sql,values)
            return res.send({message:'success'})

        }catch(e){
            return res.status(500).send({error:e.message})
        }
    },
    
    getlevelfromtoken : async (req,res)=>{
        try{
                const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({ error: "Authorization header is missing" });
            }

            const token = authHeader.split(" ")[1];
            
            if (!token) {
                console.log("Token is missing");
                return res.status(401).json({ error: "Token is missing" });
            }
            
            
            
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            /*   console.log(decoded)
            return  */
            const level = decoded.level

         

            return res.send({level:level})
        }catch(e){
            return res.status(500).send({error:e.message})
        }
    }
    
}