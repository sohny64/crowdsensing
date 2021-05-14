const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./Pollution')
require('/Decibel')
require('/AtmPress')

app.use(bodyParser.json())

const Pollution = mongoose.model("pollution")
const Decibel = mongoose.model("decibel")
const AtmPress = mongoose.model("pressure")

const mongoUri = "mongodb+srv://test:test@cluster0.i1kma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongo")
})
mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})

app.get('/',(req,res)=>{
    Pollution.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})


app.post('/send-data',(req,res)=>{
     const pollution = new Pollution({
       firstName:req.body.firstName,
       lastName:req.body.lastName,
       picture:req.body.picture
     })
     pollution.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })
})

app.listen(3000,()=>{
    console.log("server running")
})
