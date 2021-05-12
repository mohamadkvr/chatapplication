let users = [] 

function userJoin (id, username , room) {

     const user = {id, username, room};
     users.push(user)

     return user
}

//get current user

function currentUser (id) {
             return users.find(user => user.id === id)
}

// user leave chat 

function userLeave (id) {
     let index = users.findIndex(user => user.id === id);

     if (index !== -1) {

       return  users.splice(index, 1)[0]
     }
}

// get room of user

function GetRoom (room) {
      
      return users.filter(user => user.room === room);
      
}


module.exports = {userJoin, currentUser,GetRoom,userLeave}