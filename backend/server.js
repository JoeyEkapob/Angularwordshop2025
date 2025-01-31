const express = require('express')
const app = express()

const bodyParser = require("body-parser")
const pool = require('./controllers/config/db')
const cors = require("cors")

const userController = require('./controllers/usercontroller')
const FoodTypecontroller = require('./controllers/foodtypecontroller')
const foodtypecontroller = require('./controllers/foodtypecontroller')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.post('/api/user/signin',(req,res) => userController.signin(req,res))
app.post("/api/foodtype/create",(req,res)=> foodtypecontroller.create(req,res))

app.listen(3000,()=>{
    console.log('API sever Running...')
})




