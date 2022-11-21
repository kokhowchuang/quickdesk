const take = document.getElementById("take");
const lastIssuedNumber = document.getElementById("last-issued-number");
const nowServingNumber = document.getElementById("now-serving-number");
const users = document.querySelector(".users");

//Socket server URL
const socket = io.connect("http://localhost:3000");

//Emitting username and roomname of newly joined user to server
socket.emit("joined-user", {
  username: "dashboard",
  roomname: "dispenser",
});

//Sending data when user clicks send
take.addEventListener("click", () => {
  socket.emit("take-number", {});
});

//Displaying if new user has joined the room
socket.on("show-number", (data) => {
  lastIssuedNumber.innerHTML = "<p><strong><em>" + data + " </strong></em></p>";
});

//Displaying if new user has joined the room
socket.on("show-current", (data) => {
  nowServingNumber.innerHTML = "<p><strong><em>" + data + " </strong></em></p>";
});

//Displaying online users
socket.on("online-users", (data) => {
  users.innerHTML = "";

  data.forEach((user) => {
    if (user.username !== "dashboard") {
      var userContainer = `<div class="user_container">`;
      userContainer += user.offline
        ? `<span class="dot"></span>`
        : "<span></span>";
      userContainer += `<p class="username">Counter ${user.username}</p><p>${user.serving}</p>`;
      userContainer += `</div>`;

      users.innerHTML = userContainer;
    }
  });
});
