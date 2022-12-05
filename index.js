
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const houseRouter = require('./routes/House')
const mongoose = require("mongoose");

const app=express()
app.use(express.json())
app.use(cors())
app.use('/api/house', houseRouter);
const PORT = process.env.PORT || 5000

const uri ="mongodb+srv://hoangnhan:hoangnhan1911@cluster0.tfiehdw.mongodb.net/IOT?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

connect();

const server=app.listen(PORT,()=> console.log(`Server started on port ${PORT}`))

/*const io = require('socket.io')(server,{
    cors: {origin: "*"}
});*/
const io = require('./socket.js').init(server);



io.on('connection',(socket)=>{
    console.log('client-connect');

    socket.on('sendmess',(data)=>{
        module.exports=data;
    })

    

    socket.on('disconnect',()=>{
        console.log('client disconnect');
    })
});





