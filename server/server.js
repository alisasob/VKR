const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const getPlayers = require("./player").getPlayers;
const getGames = require("./game").getGames;
const G = require("./game.js");
const P = require("./player.js");

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set("port", 3000);
app.set("view engine", "ejs")
app.use("/css", express.static(path.dirname(__dirname) + "/css"));
app.use("/static", express.static(path.dirname(__dirname) + "/static"));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
    //response.render("index");
});

server.listen(3000, function(){
    console.log("Starting server on port 3000");
});

let players = null;
let games = null;
io.on("connection", (socket) => {
    players = getPlayers();
    games = getGames();
    socket.on("new player", (gId, name) => {
        let t = Object.keys(players).length;
        games = getGames();
        players[socket.id] = new P.Player({
            id: socket.id,
            name: name,
            gameId: gId,
            number: Object.keys(players).length,
        })
        if (t >= 2){
            games[gId] = new G.Game(gId, players);
            io.sockets.emit("start", games);
            players = {};
            //console.log(games[gId]);
        }
    });
    socket.on("turn", (cardId) =>
    {
        players = getPlayers();
        games = getGames();
        let gId = players[socket.id]._gameId;
        for (let i in games[gId].players[socket.id].hand){
            if (games[gId].players[socket.id].hand[i].cardClass == cardId){
                //console.log("hand cards:", games[gId].players[socket.id].hand);
                //console.log("opened cards:", games[gId].players[socket.id].openedCards);
                games[gId].players[socket.id].openedCards.push(games[gId].players[socket.id].hand.splice(i, 1)[0])
                //console.log("hand cards:", games[gId].players[socket.id].hand);
                //console.log("opened cards:", games[gId].players[socket.id].openedCards);
            };
        };
        let active = games[gId].activePlayers;
        let i;
        for (i in active){
            if (active[i] == games[gId].turningPlayer){
                break;
            };
        };
        i++;
        if (i == Object.keys(active).length){
            i = 0;
        };
        games[gId].turningPlayer = active[i];
        games[gId].players[games[gId].turningPlayer].hand.push(games[gId].drawCard);
        //console.log(games[gId].activePlayers);
        io.sockets.emit("start", games);
        //console.log(games);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
});