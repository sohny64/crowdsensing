const mongoose = require('mongoose')

const DecibelSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    sound:String
})


mongoose.model("decibel",DecibelSchema)
