var socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

console.log(username, room);

socket.emit("joinRoom", { username, room });

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("chat message", input.value);
        input.value = "";
    }
});

socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on("message", (message) => {
    var item = document.createElement("li");
    item.textContent = message;
    messages.appendChild(item);
});

function showMessage(message) {

}
