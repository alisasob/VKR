const C = require("./card.js");
//const P = require("./player.js");
const games = {};

class Game{
    constructor (gId, players){
        this._id = gId;
        // Создать карты и колоду
        this.cardsPool = [];
        this.fillCardPool();
        // Создать игроков
        this.players = players;
        let s = Math.round(Math.random() * (Object.keys(this.players).length - 1 - 0) + 0);  // индекс игрока, чей ход
        // Раздать карты
        for (let player in this.players){ 
            players[player].hand.push(this.drawCard);
            if (players[player]._num == s){
                this.turningPlayer = players[player]._id;
            }
        }
        this.players[this.turningPlayer].hand.push(this.drawCard);
    }

    get drawCard () {
        return (this.cardsPool.splice(Math.random() * (Object.keys(this.cardsPool).length - 1 - 0) + 0, 1)[0]);
    }

    fillCardPool(){
         // 4 policies
        this.cardsPool.push(new C.Card('police', 1, 4));
        this.cardsPool.push(new C.Card('police', 1, 4));
        this.cardsPool.push(new C.Card('police', 1, 4));
        this.cardsPool.push(new C.Card('police', 1, 4));
        // 1 sheriff
        this.cardsPool.push(new C.Card('sheriff', 1, 1));
        // 2 witnesses
        this.cardsPool.push(new C.Card('witness', 2, 2));
        this.cardsPool.push(new C.Card('witness', 2, 2));
        // 1 judge
        this.cardsPool.push(new C.Card('judge', 3, 1));
        // 2 lawyers
        this.cardsPool.push(new C.Card('lawyer', 4, 2));
        this.cardsPool.push(new C.Card('lawyer', 4, 2));
        // 2 killers
        this.cardsPool.push(new C.Card('killer', 5, 2));
        this.cardsPool.push(new C.Card('killer', 5, 2));
        // 2 setups
        this.cardsPool.push(new C.Card('setup', 6, 2));
        this.cardsPool.push(new C.Card('setup', 6, 2));
        // 1 godfather
        this.cardsPool.push(new C.Card('godfather', 7, 1));
        // 1 million
        this.cardsPool.push(new C.Card('million', 8, 1));
    }
}

module.exports.getGames = () => {
    return games;
};

module.exports.Game = Game;