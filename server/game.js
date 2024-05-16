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
            //console.log(this.players[player].hand);
            if (players[player]._num == s){
                this.turningPlayer = players[player]._id;
            }
        }
        //console.log(this.turningPlayer);
        this.players[this.turningPlayer].hand.push(this.drawCard);
        //console.log(this.players[this.turningPlayer].hand);
        // for (let player in this.players){ 
        //     console.log(this.players[player]);
        // }
    }
    get drawCard () {
        return (this.cardsPool.splice(Math.random() * (Object.keys(this.cardsPool).length - 1 - 0) + 0, 1)[0]);
    }
    fillCardPool(){
        // 4 policies
        this.cardsPool.push(new C.Card(1, 'card_img1.png', '#b4dbbc', '#edfff1', '#edfff1', 4));
        this.cardsPool.push(new C.Card(1, 'card_img1.png', '#b4dbbc', '#edfff1', '#edfff1', 4));
        this.cardsPool.push(new C.Card(1, 'card_img1.png', '#b4dbbc', '#edfff1', '#edfff1', 4));
        this.cardsPool.push(new C.Card(1, 'card_img1.png', '#b4dbbc', '#edfff1', '#edfff1', 4));
    
        // 1 sheriff
        this.cardsPool.push(new C.Card(1, 'card_img11.png', '#b4dbbc', '#edfff1', 
                                          'radial-gradient(circle, #b4dbbc 30%, #edfff1 100%);', 1));
    
        // 2 witnesses
        this.cardsPool.push(new C.Card(2, 'card_img2.png', '#dded77', '#f9ffd1', '#f9ffd1;', 2));
        this.cardsPool.push(new C.Card(2, 'card_img2.png', '#dded77', '#f9ffd1', '#f9ffd1;', 2));
    
        // 1 judge
        this.cardsPool.push(new C.Card(3, 'card_img3.png', '#e88d98', '#ffbdcc', '#ffbdcc;', 3));
    
        // 2 lawyers
        this.cardsPool.push(new C.Card(4, 'card_img4.png', '#d177e0', '#f2abff', '#f2abff;', 2));
        this.cardsPool.push(new C.Card(4, 'card_img4.png', '#d177e0', '#f2abff', '#f2abff;', 2));
    
        // 2 killers
        this.cardsPool.push(new C.Card(5, 'card_img5.png', '#67b7c2', '#8bd2db', '#8bd2db;', 2));
        this.cardsPool.push(new C.Card(5, 'card_img5.png', '#67b7c2', '#8bd2db', '#8bd2db;', 2));
    
        // 2 setups
        this.cardsPool.push(new C.Card(6, 'card_img6.png', '#667ad4', '#879bf0', '#879bf0;', 2));
        this.cardsPool.push(new C.Card(6, 'card_img6.png', '#667ad4', '#879bf0', '#879bf0;', 2));
    
        // 1 godfather
        this.cardsPool.push(new C.Card(7, 'card_img7.png', '#7d67d6', '#9984ed', '#9984ed;', 1));
    
        // 1 million
        this.cardsPool.push(new C.Card(8, 'card_img8.png', '#B67C00', ' #deab1c', 
                                          'linear-gradient(135deg, #deab1c 20%, #ffe555 50%, #deab1c 100%);', 1));
    }
}

module.exports.getGames = () => {
    // socket.on("new game", (gId, players) => {
    //     console.log('am in game!');
    //     games[gId] = new Game(gId, players);
    //     console.log('am in game!');
    //     console.log(games[gId]);
    //     //let t = Object.keys(players).length;
    //     //if (t % 3 == 2){
    //         //socket.emit("new game", (players))
    //         //console.log(players[t])
    //     //}
    // });

    // socket.on("disconnect", () => {
    //     delete players[socket.id];
    // });
    return games;
};

// module.exports.getGames = (socket1) => {
//     socket1.on("new game", (players) => {
//         console.log("holly shit")
//         games[Object.keys(games).length + 1] = new Game(players)
//     });
// }


// let players = [];
// players.push(new Player({ id: 0, name: "chch"}));
// players.push(new Player({ id: 1, name: "qqqq"}));
// players.push(new Player({ id: 2, name: "wwww"}));
// let game = new Game(players);
// for (let player of game.players){ 
//    console.log(player._name);
//    console.log(player.hand);
// }

module.exports.Game = Game;