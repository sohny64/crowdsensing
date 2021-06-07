const mongoose = require('mongoose')

const PollutionSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    pollutionInCity: String
})

mongoose.model("pollution",PollutionSchema)
