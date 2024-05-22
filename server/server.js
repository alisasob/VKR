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
    socket.on("turn", (cardId, victim) =>
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
        if (cardId == 'police'){
            if (victim != games[gId].turningPlayer){
                games[gId].players[victim].active = false;
                games[gId].players[victim].openedCards.push(games[gId].players[victim].hand.splice(0, 1)[0]);
            }
        }else 
        if (cardId == 'sheriff'){}else 
        if (cardId == 'witness'){}else 
        if (cardId == 'judge'){
            let c = (games[gId].players[socket.id].hand[0].cardClass == 'judge') ? 1
                                                                                 : 0;
            if (games[gId].players[victim].hand[0].rank < games[gId].players[socket.id].hand[c].rank){
                games[gId].players[victim].active = false;
                games[gId].players[victim].openedCards.push(games[gId].players[victim].hand.splice(0, 1)[0]);
            } else 
            if (games[gId].players[victim].hand[0].rank > games[gId].players[socket.id].hand[c].rank){
                games[gId].players[socket.id].active = false;
                games[gId].players[socket.id].openedCards.push(games[gId].players[socket.id].hand.splice(0, 1)[0]);
            }
        }else 
        if (cardId == 'lawyer'){
            games[gId].players[socket.id].protected = true;
        }else 
        if (cardId == 'killer'){
            games[gId].players[victim].openedCards.push(games[gId].players[victim].hand.splice(0, 1)[0]);
            if (games[gId].players[victim].openedCards[Object.keys(games[gId].players[victim].openedCards).length - 1].cardClass == 'million'){
                games[gId].players[victim].active = false;
            } else{
                games[gId].players[victim].hand.push(games[gId].drawCard);
            };
        }else 
        if (cardId == 'setup'){
            if (victim != games[gId].turningPlayer){
                games[gId].players[games[gId].turningPlayer].hand.push(games[gId].players[victim].hand.splice(0, 1)[0]);
                games[gId].players[victim].hand.push(games[gId].players[games[gId].turningPlayer].hand.splice(0, 1)[0]);
            };
        }else 
        if (cardId == 'godfather'){}else 
        if (cardId == 'million'){
            games[gId].players[socket.id].active = false;}
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
        games[gId].players[games[gId].turningPlayer].protected = false;
        //console.log(games[gId].activePlayers);
        if (Object.keys(active).length <= 1 || Object.keys(games[gId].cardsPool).length <= 1){
            let winner = active[0];
            let c = 0;
            if (Object.keys(active).length <= 1){
                winner = active[0];
            } else {
                for (let i in active){
                    if (active[i].hand[0].rank == winner.rank){
                        c++;
                    } else
                    if (active[i].hand[0].rank > winner.rank){
                        winner = active[i];
                        c = 1;
                    }
                };
                if (c > 1) {
                    let winnerSum = 0;
                    for (let i in active){
                        let playerSum = 0;
                        for (let j in active[i].openedCards){
                            playerSum += active[i].openedCards[j];
                        };
                        if (playerSum > winnerSum){
                            winnerSum = playerSum;
                            winner = active[i];
                        };
                    };
                };
            };
            io.sockets.emit("end", winner);
        } else{
        io.sockets.emit("start", games);
    };
        //console.log(games);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
});