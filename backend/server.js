const express = require('express')
const app = express()

const bodyParser = require("body-parser")
const pool = require('./controllers/config/db')
const cors = require("cors")

const userController = require('./controllers/usercontroller')
const FoodTypecontroller = require('./controllers/foodtypecontroller')
const foodtypecontroller = require('./controllers/foodtypecontroller')
const foodsizecontroller = require('./controllers/foodsizecontroller')
const tastecontroller = require('./controllers/tastecontroller')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

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

app.listen(3000,()=>{
    console.log('API sever Running...')
})




