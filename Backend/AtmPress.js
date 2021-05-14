const mongoose = require('mongoose')

const PressureSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    pressure:String
})


mongoose.model("pressure",PressureSchema)
