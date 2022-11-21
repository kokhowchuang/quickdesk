const output = document.getElementById("output");
const message = document.getElementById("message");
const operate = document.getElementById("operate");
const call = document.getElementById("call");
const complete = document.getElementById("complete");

const feedback = document.getElementById("feedback");
const roomMessage = document.querySelector(".room-message");
const users = document.querySelector(".users");

//Socket server URL
const socket = io.connect("http://localhost:3000");

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get("username");
const roomname = urlParams.get("roomname");

//Display the roomname the user is connected to
roomMessage.innerHTML = `Connected in room ${roomname}`;

//Emitting username and roomname of newly joined user to server
socket.emit("joined-user", {
  username: username,
  roomname: roomname,
});

//Displaying the message sent from user
socket.on("chat", (data) => {
  output.innerHTML +=
    "<p><strong>" + data.username + "</strong>: " + data.message + "</p>";
  feedback.innerHTML = "";
  document.querySelector(".chat-message").scrollTop =
    document.querySelector(".chat-message").scrollHeight;
});

//Displaying if a user is typing
socket.on("typing", (user) => {
  feedback.innerHTML = "<p><em>" + user + " is typing...</em></p>";
});

//Displaying online users
socket.on("online-users", (data) => {
  users.innerHTML = "";
  data.forEach((user) => {
    users.innerHTML += `<p>${user.username}</p>`;
  });
});

// Online or offline when click
operate.addEventListener("click", () => {
  socket.emit("operate", {});
});

// Call next number when click
call.addEventListener("click", () => {
  socket.emit("call", {});
});

// Complete number when click
complete.addEventListener("click", () => {
  socket.emit("complete", {});
});
