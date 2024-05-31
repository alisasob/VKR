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

app.set("port", 80);
app.set("view engine", "ejs")
app.use("/css", express.static(path.dirname(__dirname) + "/css"));
app.use("/static", express.static(path.dirname(__dirname) + "/static"));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
    //response.render("index");
});

server.listen(80, function(){
    console.log("Starting server on port 80");
});

let players = null;
let games = null;
io.on("connection", (socket) => {
    players = getPlayers();
    games = getGames();
    let cGames = [];
    for (let i in players){
        if (!cGames.includes(players[i]._gameId) && !games[players[i]._gameId]){
            cGames.push(players[i]._gameId);

        };
    };
    socket.emit("new gId", cGames);
    socket.on("new player", (gId, name) => {
        games = getGames();
        let t = 0;
        let p = {};
        for (let i in players){
            if (players[i]._gameId == gId){
                p[i] = players[i];
                t++;
            };
        };
        if (t < 3){
            players[socket.id] = new P.Player({
                id: socket.id,
                name: name,
                gameId: gId,
                number: t,
            })
        } else {
            socket.emit("overflow");
            return;
        }
        p[socket.id] = players[socket.id];
        if (t >= 2){
            games[gId] = new G.Game(gId, p);
            io.sockets.emit("start", games);
        }
    });
    socket.on("turn", (cardId, victim) =>
    {
        players = getPlayers();
        games = getGames();
        let gId = players[socket.id]._gameId;
        for (let i in games[gId].players[socket.id].hand){
            if (games[gId].players[socket.id].hand[i].cardClass == cardId){
                games[gId].players[socket.id].openedCards.push(games[gId].players[socket.id].hand.splice(i, 1)[0])
            };
        };
        if (cardId == 'police'){
            if (victim != games[gId].turningPlayer){
                games[gId].players[victim].active = false;
                games[gId].players[victim].openedCards.push(games[gId].players[victim].hand.splice(0, 1)[0]);
            }
        }else 
        if (cardId == 'sheriff'){
            if (victim != games[gId].turningPlayer){
                if (victim == 'death'){
                    games[gId].players[socket.id].active = false;
                    games[gId].players[socket.id].openedCards.push(games[gId].players[socket.id].hand.splice(0, 1)[0]);
                } else {
                    games[gId].players[victim].active = false;
                    games[gId].players[victim].openedCards.push(games[gId].players[victim].hand.splice(0, 1)[0]);
                };
            }
        }else 
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
            games[gId].players[socket.id].active = false;
            games[gId].players[socket.id].openedCards.push(games[gId].players[socket.id].hand.splice(0, 1)[0]);
        }
        let active = games[gId].activePlayers;
        let i;
        let c = 0;
        for (i in active){
            if (active[i] == games[gId].turningPlayer){
                c++;
                break;
            };
        };
        if (c != 0){
            i++;
        };
        if (i == Object.keys(active).length){
            i = 0;
        };
        games[gId].turningPlayer = active[i];
        games[gId].players[games[gId].turningPlayer].hand.push(games[gId].drawCard);
        games[gId].players[games[gId].turningPlayer].protected = false;
        if (Object.keys(active).length <= 1 || Object.keys(games[gId].cardsPool).length <= 1){
            let winner = active[0];
            let c = 0;
            if (Object.keys(active).length <= 1){
                winner = active[0];
            } else {
                for (let i in active){
                    if ( games[gId].players[active[i]].hand[0].rank == games[gId].players[winner].hand[0].rank){
                        c++;
                    } else
                    if (games[gId].players[active[i]].hand[0].rank > games[gId].players[winner].hand[0].rank){
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
            for (let i in games[gId].players){
                delete players[i];
            }
            delete games[gId];
            io.sockets.emit("end", winner);
        } else{
        io.sockets.emit("start", games);
    };
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
});