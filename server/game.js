const games = {};

class Game{
    constructor (players){
        // Создать карты и колоду
        this.cardsPool = []
        this.fillCardPool()
        // Создать игроков
        this.players = []
        this.turningPlayer = Math.round(Math.random() * (Object.keys(players).length - 0) + 0)  // индекс игрока, чей ход
        // Раздать карты
        for (let player of this.players){ 
            this.players.hand.push(this.drawCard)
        }
        this.players[this.turningPlayer].hand.push(this.drawCard)
    }
    get drawCard () {
        return (this.cardsPool.pop(Math.random() * (this.cardsPool.length - 1 - 0) + 0));
    }
    fillCardPool(){
        // 4 policies
        this.cardsPool.push({rating:  1, name: "police"})
        this.cardsPool.push({rating:  1, name: "police"})
        this.cardsPool.push({rating:  1, name: "police"})
        this.cardsPool.push({rating:  1, name: "police"})
    
        // 1 sheriff
        this.cardsPool.push({rating:  1, name: "sheriff"})
    
        // 2 witnesses
        this.cardsPool.push({rating: 2, name: "witness"})
        this.cardsPool.push({rating: 2, name: "witness"})
    
        // 1 judge
        this.cardsPool.push({rating: 3, name: "judge"})
    
        // 2 lawyers
        this.cardsPool.push({rating: 4, name: "lawyer"})
        this.cardsPool.push({rating: 4, name: "lawyer"})
    
        // 2 killers
        this.cardsPool.push({rating: 5, name: "killer"})
        this.cardsPool.push({rating: 5, name: "killer"})
    
        // 2 scoundrels
        this.cardsPool.push({rating: 6, name: "setup"})
        this.cardsPool.push({rating: 6, name: "setup"})
    
        // 1 godfather
        this.cardsPool.push({rating: 7, name: "godfather"})
    
        // 1 million
        this.cardsPool.push({rating: 8, name: "million"})
    }
}


module.exports.getGames = (socket1) => {
    socket1.on("new game", (players) => {
        console.log("holly shit")
        games[Object.keys(games).length + 1] = new Game(players)
    });
}
