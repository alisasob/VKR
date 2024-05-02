const Card = require("./card.js");
const Player = require("./player.js");
class Game{
    constructor (players){
        // Создать карты и колоду
        this.cardsPool = [];
        this.fillCardPool();
        // Создать игроков
        this.players = players;
        this.turningPlayer = Math.round(Math.random() * (Object.keys(players).length - 0) + 0);  // индекс игрока, чей ход
        // Раздать карты
        for (let player in this.players){ 
            this.players[player].hand.push(this.drawCard);
        }
        this.players[this.turningPlayer].hand.push(this.drawCard);
    }
    get drawCard () {
        return (this.cardsPool.pop(Math.random() * (this.cardsPool.length - 1 - 0) + 0));
    }
    fillCardPool(){
        // 4 policies
        this.cardsPool.push(new Card(1, 'img', 'D0000D', 'white', 4));
        this.cardsPool.push(new Card(1, 'img', 'D0000D', 'white', 4));
        this.cardsPool.push(new Card(1, 'img', 'D0000D', 'white', 4));
        this.cardsPool.push(new Card(1, 'img', 'D0000D', 'white', 4));
    
        // 1 sheriff
        this.cardsPool.push(new Card(1.5, 'img', 'D0000D', 'white', 1));
    
        // 2 witnesses
        this.cardsPool.push(new Card(2, 'img', 'D0000D', 'white', 2));
        this.cardsPool.push(new Card(2, 'img', 'D0000D', 'white', 2));
    
        // 1 judge
        this.cardsPool.push(new Card(3, 'img', 'D0000D', 'white', 3));
    
        // 2 lawyers
        this.cardsPool.push(new Card(4, 'img', 'D0000D', 'white', 2));
        this.cardsPool.push(new Card(4, 'img', 'D0000D', 'white', 2));
    
        // 2 killers
        this.cardsPool.push(new Card(5, 'img', 'D0000D', 'white', 2));
        this.cardsPool.push(new Card(5, 'img', 'D0000D', 'white', 2));
    
        // 2 setups
        this.cardsPool.push(new Card(6, 'img', 'D0000D', 'white', 2));
        this.cardsPool.push(new Card(6, 'img', 'D0000D', 'white', 2));
    
        // 1 godfather
        this.cardsPool.push(new Card(7, 'img', 'D0000D', 'white', 1));
    
        // 1 million
        this.cardsPool.push(new Card(8, 'card_img8.png', 'background-image: linear-gradient(135deg, #deab1c 20%, #ffe555 50%, #deab1c 100%);', '#B67C00', 1));
    }
}

// module.exports.getGames = (socket1) => {
//     socket1.on("new game", (players) => {
//         console.log("holly shit")
//         games[Object.keys(games).length + 1] = new Game(players)
//     });
// }
let players = [];
players.push(new Player({ id: 0, name: "chch"}));
players.push(new Player({ id: 1, name: "qqqq"}));
players.push(new Player({ id: 2, name: "wwww"}));
let game = new Game(players);
for (let player of game.players){ 
   console.log(player._name);
   console.log(player.hand);
}