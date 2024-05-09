const G = require("./game.js");

const players = {};

class Player{
    constructor (props){
        this._name = props.name;
        this._id = props.id;
        this._gameId = props.gameId;
        this._num = props.number;

        this.hand = [];
        this.openedCards = [];
        this.active = true;
    }
    get lastCard () {
        let retVal = {};
        if (this.openedCards.length() > 0) retVal = this.openedCards[-1];
        return retVal;
    }
};

module.exports.getPlayers = (socket) => {
    socket.on("new player", (gId, name) => {
        let t = Object.keys(players).length;
        const games = G.getGames();
        players[socket.id] = new Player({
            id: socket.id,
            name: name,
            gameId: gId,
            number: Object.keys(players).length,
        })
        if (t % 3 == 2){
            //console.log(gId);
            // for (let player in players){
            //     console.log(players[player])
            // }
            games[gId] = new G.Game(gId, players);
            //socket.emit("new game", gId, players);
            
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
    return players;

};

//module.exports.Player = Player;