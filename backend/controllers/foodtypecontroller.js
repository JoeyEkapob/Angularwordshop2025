const { error } = require('console');
const pool = require('./config/db')


module.exports = {
    create: async (req, res) => {
        try {
           const sql = ` INSERT INTO FoodType (name, remark, status) VALUES (?, ?, ?) `;
            const values = [req.body.name, req.body.remark ?? "", "use"]; 
        

          const [res1] = await pool.query(sql, values); 
         
          return res.send({message:res1})
        } catch (e) {
            return res.send(500).send({ error: e.message })

        }
    }
}