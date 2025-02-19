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

app.use(cors())
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/uploads',express.static('./uploads'))

app.post('/api/user/signin',(req,res) => userController.signin(req,res))
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

app.post('/api/food/create',(req,res)=> foodcontroller.create(req,res))
app.post('/api/food/upload',(req,res)=>foodcontroller.upload(req,res))
app.post('/api/food/list',(req,res) => foodcontroller.list(req,res))
app.delete('/api/food/remove/:id',(req,res)=>foodcontroller.remove(req,res))
app.put('/api/food/update',(req,res)=>foodcontroller.update2(req,res))

app.post('/api/food/filter',(req,res)=>foodcontroller.filter(req,res))
app.post('/api/saletemp/create',(req,res)=>{saletempconttroller.create(req,res)})
app.post('/api/saletemp/list',(req,res)=>saletempconttroller.list(req,res))
app.delete('/api/saletemp/clear/:userId',(req,res)=>saletempconttroller.clear(req,res))
app.delete('/api/saletemp/remove/:foodid/:userid',(req,res)=>{saletempconttroller.remove(req,res)})
app.put('/api/saletemp/changeqty',(req,res)=>{saletempconttroller.changeqty(req,res)})
app.post('/api/saletemp/createdetail',(req,res)=>saletempconttroller.createDetail(req,res))
app.post('/api/saletemp/listsaletempdetail',(req,res)=>saletempconttroller.listsaletempdetail(req,res))
app.post('/api/saletemp/updatefoodsize',(req,res)=>saletempconttroller.updateFoodsize(req,res))



app.post('/api/foodsize/filter/',(req,res)=>foodsizecontroller.filter(req,res))

app.listen(3000,()=>{
    console.log('API sever Running...')
})




