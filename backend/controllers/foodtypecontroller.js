const pool = require('./config/db')


module.exports = {
    create: async (req, res) => {
        try {
            const sql = ` INSERT INTO FoodType (name, remark, status) VALUES (?, ?, ?) `;
            const values = [req.body.name, req.body.remark ?? "", "use"];


            const [res1] = await pool.query(sql, values);

            return res.send({ message: "success" })
        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    list: async (req, res) => {
        try {
            const sql = `SELECT * FROM FoodType WHERE status = 'use'`;
            const [rows] = await pool.query(sql)

            return res.send({ result: rows })

        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    remove: async (req, res) => {
        try {
            const sql = `UPDATE FoodType SET status = ?  WHERE id = ?`;
            const values = ['delete', parseInt(req.params.id)];
            const [rows] = await pool.query(sql, values)

            return res.send({ message: "success" })

        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    },
    update: async (req, res) => {
        try {
            const sql = `UPDATE FoodType SET name = ? , remark = ? WHERE id = ?`
            const values = [req.body.name, req.body.remark, req.body.id]

            const [rows] = await pool.query(sql, values)
            return res.send({ message: "success" })

        } catch (e) {
            return res.status(500).send({ error: e.message })

        }
    }
}