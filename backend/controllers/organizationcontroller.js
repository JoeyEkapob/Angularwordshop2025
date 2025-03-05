
const pool = require('./config/db')
const { upload } = require('./foodcontroller')
const fs = require('fs')

module.exports ={
    create : async (req,res)=>{
      /*   console.log('2')
        return */
         try{
            const sql = `SELECT * FROM Orgnization  LIMIT 1`
            const [orgenizationsql] = await pool.query(sql)
         /*    console.log(orgenizationsql) */
            

         const payload = {
                id:req.body.id,
                name: req.body.name,
                address:req.body.address ?? '',
                phone:req.body.phone ?? '',
                email:req.body.email ?? '',
                taxCode: req.body.taxCode ?? '',
                logo:req.body.logo ?? orgenizationsql[0].logo,
                website:req.body.website ?? '',
                promptPay : req.body.promptPay ?? ''
            }

        

         /*  if (fs.existsSync(`uploads/${req.body.logo}`) ){
                console.log('ไฟล์มีอยู่แล้ว');
            }else{
                console.log('ไฟล์มีอยู่แล้ว ไม่มี');

            } */
          
            if(req.body.logo){
                const fs = require('fs')

                if(fs.existsSync(`uploads/${orgenizationsql[0].logo}`)){
                    fs.unlinkSync(`uploads/${orgenizationsql[0].logo}`)
                }
            }
            let result
            if(orgenizationsql){
              /*   console.log(payload.logo)
                return */
               const sql2 = `UPDATE Orgnization 
                SET name = ?, address = ?, phone = ?, 
                email = ?, taxCode = ?, logo = ?, website = ?, promptPay = ? 
                WHERE id = ?`;
                const values = [
                    payload.name,
                    payload.address,
                    payload.phone,
                    payload.email,
                    payload.taxCode,
                    payload.logo,
                    payload.website,
                    payload.promptPay,
                    payload.id // ใช้ค่า id จาก req.body
                ];
               await pool.query(sql2,values)
               result = payload.id
                
            }else{
             
            const sql2 = `INSERT INTO Orgnization 
                                (name, address, phone, email, taxCode, logo, website, promptPay) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                const values = [
                    payload.name,
                    payload.address,
                    payload.phone,
                    payload.email,
                    payload.taxCode,
                    payload.logo,
                    payload.website,
                    payload.promptPay
                ];                
                 await pool.query(sql2,values) 
                 result = { id: insertResult.insertId }; 
            } 
          
             return res.json(result)
        }catch(e){
            return res.status(500).json({error:e.message})

        } 
    },
    info:async (req,res)=>{
        try{

            const sql = `SELECT * FROM Orgnization `
            const rows = await pool.query(sql)
            return res.send(rows[0] ?? {}) 

        }catch(e){
            return res.status(500).json({error:e.message})
        }
    },
    upload:async (req,res)=>{
        /* console.log(req.files.myFile)
        console.log('1')
        return */
        try{
            const myfile = req.files.myFile
            const filename = myfile.name
          
            const extenstion = filename.split('.').pop();
            const newname = `${new Date().getTime()}.${extenstion}`
          /*   console.log(newname)
            return */
            myfile.mv(`uploads/${newname}`,function(err){
                if(err){
                    throw err
                }
            })

            return res.send({message : 'success',filename:newname})
        }catch(e){
            return res.status(500).json({error:e.message})
        }
    },
    list: async (req, res) => {
        try {
          const  {id}  = req.params;
        /*   console.log(id)
          return */
          const [rows] = await pool.query('SELECT * FROM Orgnization WHERE id = ?', [id]);
      
          if (rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูล' });
          }
      
          res.json(rows[0]); 
        } catch (error) {
          res.status(500).json({ message: 'เกิดข้อผิดพลาด', error });
        }
    }
}