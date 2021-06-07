require("dotenv").config()
const express = require('express')
const app = express()
//const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./Pollution')
require('./Decibel')
require('./AtmPress')
const Pollution = mongoose.model("pollution")
const Decibel = mongoose.model("decibel")
const Pressure = mongoose.model("pressure")
const mongoUri = "mongodb+srv://test:test@cluster0.i1kma.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const multer = require('multer')
const {parse, stringify} = require('flatted')
const GridFsStorage = require('multer-gridfs-storage')
const fs = require('fs')

const storage = new GridFsStorage({
  url: process.env.DB,
  options: {useNewUrlParser: true, useUnifiedTopology: true},
  file: (req,file)=> {
    const match = ['image/png', 'image/jpeg'];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = '${Date.now()}-pollution-${file.originalname}';
      return filename;
    }

    return{
      bucketName: "photos",
      filename: '${Date.now()}-pollution-${file.originalname}'
    }
  }
})
const upload = multer({storage: storage})

//app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

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

//Pollution
app.post('/send-data/pollution', upload.single('pollutionInCity'), (req,res)=>{
     const pollution = new Pollution({
       firstName:req.body.firstName,
       lastName:req.body.lastName,
       pollutionInCity: req.body.pollutionInCity
     })
     pollution.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })
})

app.get('/pollution',(req,res)=>{
    Pollution.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})

//Decibel
app.post('/send-data/decibel', upload.single('sound'), (req,res)=>{
     const decibel = new Decibel({
       firstName:req.body.firstName,
       lastName:req.body.lastName,
       sound: req.body.sound
     })
     decibel.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })
})

app.get('/decibel',(req,res)=>{
    Decibel.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})

//Pressure
app.post('/send-data/pressure', /*upload.single('pollutionInCity'),*/ (req,res)=>{
     const pressure = new Pressure({
       firstName:req.body.firstName,
       lastName:req.body.lastName,
       pressure: req.body.pressure
     })
     pressure.save()
     .then(data=>{
         console.log(data)
         res.send(data)
     }).catch(err=>{
         console.log(err)
     })
})

app.get('/pressure',(req,res)=>{
    Pressure.find({}).then(data=>{
        res.send(data)
    }).catch(err=>{
        console.log(err)
    })
})

app.listen(3000,()=>{
    console.log("server running")
})
