const {Schema, model} = require("mongoose")

const DocSchema = new Schema({
    _id: String,
    data: Object,
})

module.exports = model("DocSchema", DocSchema)