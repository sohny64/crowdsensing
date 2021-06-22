const mongoose = require('mongoose')

const DecibelSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    soundPollutionInCity:String
})


mongoose.model("decibel",DecibelSchema)
