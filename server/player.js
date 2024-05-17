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
    }
    get lastCard () {
        let retVal = {};
        if (this.openedCards.length() > 0) retVal = this.openedCards[-1];
        return retVal;
    }
};

module.exports.getPlayers = () => {
    return players;
};

module.exports.Player = Player;