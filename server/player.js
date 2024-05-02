const players = {};

class Player{
    constructor (props){
        this._name = props.name;
        this._id = props.id;
        this._gameId = props.gameId;

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
    socket.on("new player", () => {
        players[socket.id] = new Player({
            id: socket.id,
            name: Object.keys(players).length + 1,
            gameId: 1,
        })
        //let t = Object.keys(players).length;
        //if (t % 3 == 2){
            //socket.emit("new game", (players))
            //console.log(players[t])
        //}
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
    return players;
};
