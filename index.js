const {SerialPort} = require("serialport");
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { ReadlineParser } = require('@serialport/parser-readline')
const { Server } = require("socket.io")
const io = new Server(server)
const port = new SerialPort({
    path:'COM3',
    baudRate:9600
}, function(err){
    console.log('Opening Serial Port')
    if(err){
        console.log('Error : '+err.message)
    }else{
        console.log(port.path + " Ready to use!")
    }
})
const parser = port.pipe(new ReadlineParser({
    delimiter: '\r\n'
}))

parser.on('data', (data) => {
    console.log(data)
    io.emit('data', data)    
})

app.get('/',(req, res)=>{
    res.sendFile('index.html',{root:'./dist'})
})

io.on("connection",(socket) =>{
    console.log('Server connected')
})

server.listen(3000, function(err){
    if(err){
        console.log("Error : "+err.message)
    }else{
        console.log("HTTP Server listening on port 3000")
    }
})