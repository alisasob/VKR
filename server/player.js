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
    socket.on("new player", (gId) => {
        let t = Object.keys(players).length;
        players[socket.id] = new Player({
            id: socket.id,
            name: t + 1,
            gameId: gId,
        })
        if (t % 3 == 2){
            socket.emit("new game", (players))
            console.log('after new game emit log')
            for (let player in players){
                console.log(players[player])
            }
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
    });
    return players;

};

module.exports.Player = Player;