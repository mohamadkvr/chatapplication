const path = require("path");
const http = require("http");
const express = require('express');
const socketio = require('socket.io');
const chatMessage = require('./utils/messages');
const {userJoin, currentUser,GetRoom,userLeave} = require('./utils/users');


const app = express();
const server = http.createServer(app);

//set static files

app.use(express.static(path.join(__dirname,"public")));

//run when client connect

const io = socketio(server);
io.on("connection",(socket)=>{

 //welcome to chat room   
    socket.on("joinNewUser",({username,room})=>{
       const user = userJoin(socket.id, username,room);
       socket.join(user.room)
        socket.emit("message",chatMessage("chat bot","welcome to chat room"))
        socket.broadcast.to(user.room).emit("message",chatMessage("chat bot",`${user.username} added to this chat room`))
  
 //send users and room into
        
       io.to(user.room).emit("roomUsers",{ 
           room : user.room,
           users : GetRoom(user.room)
       })
 
    })
   

//handel chat text

    socket.on("chatMessage",text =>{
        const user = currentUser(socket.id)
        io.to(user.room).emit("message",chatMessage(user.username,text))
    })

//disconnected

socket.on("disconnect",() =>{

    let user = userLeave(socket.id) 
    if(user) {
    io.to(user.room).emit("message",chatMessage("chat bot",`${user.username} has left the chat`))
    }
    io.to(user.room).emit("roomUsers",{ 
        room : user.room,
        users : GetRoom(user.room)
    })

})

})



const PORT = 3000 || process.env.PORT ;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));