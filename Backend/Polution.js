const mongoose = require('mongoose')

const PollutionSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    pollutionInCity:{
      data: Buffer,
      contentType:String
    }
})


mongoose.model("pollution",PollutionSchema)
