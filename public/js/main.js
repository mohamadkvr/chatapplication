const socket = io();
const roomName = document.getElementById("room-name")
const usersList = document.getElementById("users")


let chatMesseges = document.querySelector(".chat-messages")
//get username and room name

const {username, room} =  Qs.parse(location.search,{
        ignoreQueryPrefix : true
})

socket.emit("joinNewUser", {username, room})

socket.on("message",message =>{
            outPutMessage(message)

  //scroll  down
  chatMesseges.scrollTop = chatMesseges.scrollHeight
})

document.querySelector("#chat-form").addEventListener("submit", function(event) {

  event.preventDefault();
//get chat text
  let msg =  event.target.elements.msg.value

//emit message to server

  socket.emit("chatMessage", msg)

  //clear input 

  event.target.elements.msg.value = ""
  event.target.elements.msg.focus()


  
});

socket.on("roomUsers", ({room, users}) => {

  console.log(room)
          outPutRoomName(room)
          outPutUsers(users)
})

function outPutMessage (msg) {
       let div = document.createElement("div")
       console.log(msg)
       div.classList.add("message")


       div.innerHTML = `
       <p class = "meta">
                ${msg.username} <span>${msg.time}</span>
       </p>
       <p class = "text">
             ${msg.text}             
      </p>
       `
       document.querySelector(".chat-messages").appendChild(div)
}

function outPutRoomName(room) {
     roomName.innerText = room
}

function  outPutUsers (users) {
  usersList.innerHTML = 
           `
             ${users.map(user => `<li>${user.username}</li>` ).join("")}

           `
}