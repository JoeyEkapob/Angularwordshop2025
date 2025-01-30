const express = require('express')
const app = express()

const bodyParser = require("body-parser")
const pool = require('./controllers/config/db')
const cors = require("cors")

const userController = require('./controllers/usercontroller')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.post('/api/user/signin',(req,res) => userController.signin(req,res))

app.listen(3000,()=>{
    console.log('API sever Running...')
})




