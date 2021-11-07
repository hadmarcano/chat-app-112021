// Initializing Socket-io library
const socket = io();

socket.on("message", (message) => {
  console.log(message);
});


document.querySelector('#send').addEventListener('submit',(e)=>{
  e.preventDefault();

  const message = e.target.elements.content.value;
  socket.emit('sendMessage',message,(error)=>{

    if(error){
      console.log(error);
    }
    console.log("Message delivered");
  });
});

document.getElementById("send-location").addEventListener('click',()=>{
  if(!navigator.geolocation){
    return alert("The location data is not supported for your browser!");
  }

  navigator.geolocation.getCurrentPosition((position)=>{
    
    socket.emit("sendLocation", {
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    },(error)=>{

      if(error){
        console.log(error);
      }
      console.log("Location is shared!");
    }); 

  });

});