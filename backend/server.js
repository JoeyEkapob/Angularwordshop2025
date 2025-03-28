const express = require('express')
const app = express()

const bodyParser = require("body-parser")
const pool = require('./controllers/config/db')
const cors = require("cors")
const fileUpload =require('express-fileupload')

const userController = require('./controllers/usercontroller')
const foodtypecontroller = require('./controllers/foodtypecontroller')
const foodsizecontroller = require('./controllers/foodsizecontroller')
const tastecontroller = require('./controllers/tastecontroller')
const foodcontroller = require('./controllers/foodcontroller')
const saletempconttroller = require('./controllers/saletempconttroller')
const organizationcontroller = require('./controllers/organizationcontroller')
const billsalecontroller = require('./controllers/billsalecontroller')
const reportcontroller = require('./controllers/reportcontroller')

app.use(cors())
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/uploads',express.static('./uploads'))


const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()


function isSignIn(req,res,next){
    try{
       
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        const level = decoded.level
       
        if(level !== null){
           next()
        }else{
            return res.status(401).send({ error : "Unauthorized"})
        }
    }catch(e){
      /*   return console.log(req) */
        return res.status(401).send({error:"Unauthorized"})
    }
}

app.post('/api/user/signin',(req,res) => userController.signin(req,res))
app.post('/api/user/list',(req,res)=> userController.list(req,res))
app.post('/api/user/create',(req,res)=>userController.create(req,res))
app.delete('/api/user/remove/:id',(req,res)=>userController.remove(req,res))
app.put('/api/user/update',(req,res)=>userController.update(req,res))
app.get('/api/user/getlevelfromtoken',(req,res)=> userController.getlevelfromtoken(req,res))


app.post("/api/foodtype/create",(req,res)=> foodtypecontroller.create(req,res))
app.post("/api/foodtype/list",(req,res)=> foodtypecontroller.list(req,res))
app.delete("/api/foodtype/remove/:id",(req,res)=> foodtypecontroller.remove(req,res))
app.put('/api/foodtype/update',(req,res)=>foodtypecontroller.update(req,res))


app.post('/api/foodsize/create',(req,res)=>foodsizecontroller.create(req,res))
app.post('/api/foodsize/list',(req,res)=> foodsizecontroller.list(req,res))
app.delete('/api/foodsize/remove/:id',(req,res)=>foodsizecontroller.remove(req,res))
app.put('/api/foodsize/update',(req,res)=> foodsizecontroller.update(req,res))


app.post('/api/taste/create',(req,res)=>tastecontroller.create(req,res))
app.post('/api/taste/list',(req,res)=> tastecontroller.list(req,res))
app.delete('/api/taste/remove/:id',(req,res)=>tastecontroller.remove(req,res))
app.put('/api/taste/update',(req,res)=>tastecontroller.update(req,res))
app.post('/api/taste/listbyfoodtypeid',(req,res)=>tastecontroller.listbyfoodtypeid(req,res))

app.post('/api/food/create',(req,res)=> foodcontroller.create(req,res))
app.post('/api/food/upload',(req,res)=>foodcontroller.upload(req,res))
app.post('/api/food/list',(req,res) => foodcontroller.list(req,res))
app.delete('/api/food/remove/:id',(req,res)=>foodcontroller.remove(req,res))
app.put('/api/food/update',(req,res)=>foodcontroller.update2(req,res))
app.post('/api/food/listpaginate',(req,res)=> foodcontroller.listpage(req,res))

app.post('/api/food/filter',(req,res)=>foodcontroller.filter(req,res))
app.post('/api/saletemp/create',(req,res)=>{saletempconttroller.create(req,res)})
app.post('/api/saletemp/list',(req,res)=>saletempconttroller.list(req,res))
app.delete('/api/saletemp/clear/:userId',(req,res)=>saletempconttroller.clear(req,res))
app.delete('/api/saletemp/remove/:foodid/:userid',(req,res)=>{saletempconttroller.remove(req,res)})
app.put('/api/saletemp/changeqty',(req,res)=>{saletempconttroller.changeqty(req,res)})
app.post('/api/saletemp/createdetail',(req,res)=>saletempconttroller.createDetail(req,res))
app.post('/api/saletemp/listsaletempdetail',(req,res)=>saletempconttroller.listsaletempdetail(req,res))
app.post('/api/saletemp/updatefoodsize',(req,res)=>saletempconttroller.updateFoodsize(req,res))
app.post('/api/saletemp/updatetaste',(req,res)=> saletempconttroller.updatetaste(req,res))
app.post('/api/saletemp/newsaletempdetail',(req,res)=> saletempconttroller.newsaletempdetail(req,res)) 
app.delete('/api/saletemp/removesaletempdetail/:id',(req,res)=> saletempconttroller.removesaletempdetail(req,res))
app.post('/api/saletemp/endsale',(req,res)=>saletempconttroller.endsale(req,res))
app.post('/api/saletemp/printbtllbeforepay',(req,res)=>saletempconttroller.printbillbeforepay(req,res))
app.post('/api/saletemp/printbillafterpay',(req,res) => saletempconttroller.printbillafterpay(req,res))



app.post('/api/organization/save',(req,res)=>organizationcontroller.create(req,res))
app.post('/api/organization/info',(req,res)=>organizationcontroller.info(req,res))
app.post('/api/organization/upload',(req,res)=>organizationcontroller.upload(req,res))
app.get('/api/organization/list/:id',(req,res)=>organizationcontroller.list(req,res))


app.post('/api/foodsize/filter/',(req,res)=>foodsizecontroller.filter(req,res))


app.post('/api/billsale/list',(req,res)=> billsalecontroller.list(req,res))
app.delete('/api/billsale/remove/:id',(req,res)=> billsalecontroller.remove(req,res))


app.post('/api/report/sumperdayinyearandmonth',isSignIn  , (req,res)=> reportcontroller.sumperdayinyearandmonth(req,res))
app.post('/api/report/sumpermonthinyear', isSignIn , (req,res)=> reportcontroller.sumpermonthinyear(req,res))

app.listen(3000,()=>{
    console.log('API sever Running...')
})




