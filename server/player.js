let players = {};

class Player{
    constructor (props){
        this._name = props.name;
        this._id = props.id;
        this._gameId = props.gameId;
        this._num = props.number;

        this.hand = [];
        this.openedCards = [];
        this.active = true;
        this.protected = false;
    }
};

module.exports.getPlayers = () => {
    return players;
};

module.exports.Player = Player;