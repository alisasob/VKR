const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const getPlayers = require("./player").getPlayers;
const getGames = require("./game").getGames;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set("port", 3000);
app.use("/css", express.static(path.dirname(__dirname) + "/css"));
app.use("/static", express.static(path.dirname(__dirname) + "/static"));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

server.listen(3000, function(){
    console.log("Starting server on port 3000");
});

let players = null;
let games = null;
io.on("connection", (socket) => {
    players = getPlayers(socket);
    games = getGames(socket);
});

const gameLoop = (games, players, io) => {
    io.sockets.emit("state", games, players);
};

setInterval(() => {
    if (games && players && io) {
        gameLoop(games, players, io);
    }
}, 1000 / 60)