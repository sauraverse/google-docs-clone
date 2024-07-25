require('dotenv').config();

const mongoose= require('mongoose')
const DocSchema = require("./DocSchema")

mongoose.connect(process.env.MONGODB_URI)
const io = require('socket.io')(3001, {
    cors: {
        origin: process.env.CLIENT_ADDRESS,
        methods: ["GET", "POST"],
    },
})
const defaultValue = ""
io.on("connection", socket => {
    socket.on('get-document', async documentId => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)
        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
    })
    socket.on("save-document", async data => {
        await DocSchema.findByIdAndUpdate(documentId, {data})
    })
})
    
})

async function findOrCreateDocument(id){
    if (id== null)return

    const document = await DocSchema.findById(id)
    if(document) return document

    return await DocSchema.create({ _id: id, data: defaultValue})
}