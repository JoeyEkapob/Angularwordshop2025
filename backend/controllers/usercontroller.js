const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const pool = require('./config/db')


dotenv.config();

module.exports = {
    signin: async (req,res)=>{
        try{
            const [rows] = await pool.query(
                'SELECT id,username,level FROM users WHERE username = ? AND password = ? AND status = ?',
                [req.body.username, req.body.password, 'active']
              );

          
              const user = rows[0]; 
             /* console.log(user.username , user.id) 
             return */
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

    }
}