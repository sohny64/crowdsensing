const mongoose = require('mongoose')

const PressureSchema = new mongoose.Schema({
    pressure:String
})


mongoose.model("pressure",PressureSchema)
