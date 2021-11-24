// Initializing Socket-io library
const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.getElementById("send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessagesStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessagesStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible Hight
  const visibleHeight = $messages.offsetHeight;

  // Height of message container
  const containerHeight = $messages.scrollHeight;

  // How far I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if(containerHeight - newMessageHeight <= scrollOffset){
    $messages.scrollTop = $messages.scrollHeight;
  }
  
};

socket.on("message", (message) => {
  console.log(message);
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a"),
    });
  
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    username:location.username,
    url: location.text,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});


socket.on("roomData",({room, users})=>{
  // console.log(room);
  // console.log(users);
  const html = Mustache.render(sidebarTemplate,{
    room,
    users
  });
  document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Disable button
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.content.value;
  socket.emit("sendMessage", message, (error) => {
    // Enable button
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (error) {
      console.log(error);
    }
    console.log("Message delivered");
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("The location data is not supported for your browser!");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      (error) => {
        $sendLocationButton.removeAttribute("disabled");

        if (error) {
          console.log(error);
        }
        console.log("Location is shared!");
      }
    );
  });
});

socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error);
    location.href ="/";
  }
});
