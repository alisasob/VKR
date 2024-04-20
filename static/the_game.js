class Game{
    CT_POLICE = "police"
    CT_SHERIFF = "sheriff"
    CT_WITNESS = "witness"
    CT_JUDGE = "judge"
    CT_LAWYER = "lawyer"
    CT_KILLER = "killer"
    CT_SETUP = "setup" //SETUP
    CT_GODFATHER = "godfather"
    CT_MILLION = "million"
    
   // def __init__(this):
    constructor (){
        // Создать карты и колоду
        this.cardsPool = []
        this.fillCardPool()
        // Создать игроков
        this.players = []
        this.players.push(new Player(0))
        this.players.push(new Player(1))
        this.players.push(new Player(2))
        this.turningPlayer = Math.round(Math.random() * (this.getActivePlayersCount() - 1 - 0) + 0)  // индекс игрока, чей ход
        // Раздать карты
        this.players[0].hand.push(this.drawCard)
        this.players[1].hand.push(this.drawCard)
        this.players[2].hand.push(this.drawCard)
        this.players[this.turningPlayer].hand.push(this.drawCard)
    }

    getActivePlayersCount () {
        let c = 0
        for (let i = 0; i < 3; i++){
        if (this.players[i].active){
            c++;
        }
        }
        return c
    }
 
    get drawCard () {
        return (this.cardsPool.pop(Math.random() * (this.cardsPool.length - 1 - 0) + 0));
    }

    turn(cardName, opponentIdex){
        let cardIndex = null
        let player = this.players[this.turningPlayer]
        let i = 0
        for (card of enumerate(player.hand)){
            if (card[name] == cardName){
                cardIndex = i
            }
        if (cardIndex == None){
            //raise Exception("ERROR: Invalid card name: " + cardName)
            console.log("ERROR: Invalid card name: " + cardName)
        }
        // todo: проверить правильность хода (крестный отец - убийца/подстава)
        if (opponentIdex != None){
            if (opponentIdex < 0 || opponentIdex >= this.players.length() || !this.players[opponentIdex].active){
               // raise Exception("ERROR: invalid opponent index: " + str(opponentIdex))
               console.log("ERROR: invalid opponent index: " + str(opponentIdex))
            }
        }
        i++;
        }
        // Проверить, что оппонент указан
        // if opponentIdex is None and this.requiresOpponent(cardName):
        //     raise Exception("ERROR: No opponent specified")
        // todo: проверить правильность выбранного оппонента (полиция, шериф, судья, свидетель, судья, подстава)
        // взять из рук
        card = player.hand.pop(cardIndex)
        // выложить на стол
        player.openedCards.push(card)
        // todo: сыграть выложенную карту (выполнить действие карты)
        // Для теста - игрок, сыгравший полицию - выбывает
        if (cardName == this.CT_POLICE){
            player.active = False
        }
        // передать ход след. игроку
        while (this.getActivePlayersCount() > 1){
            this.turningPlayer += 1
            if (this.turningPlayer >= this.players.length()){
                this.turningPlayer = 0
            }
            if (this.players[this.turningPlayer].active){
                break
            }
        }
        // вытянуть карту
        this.players[this.turningPlayer].hand.append(this.drawCard())
    }

    requiresOpponent(cardName){
        if (cardName in [this.CT_POLICE, this.CT_SHERIFF, this.CT_WITNESS, this.CT_JUDGE, this.CT_KILLER, this.CT_Setup]){
            return 1;
        }
        else {
            return 0;
        }
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


const game = new Game()
while (game.cardsPool.length > 1 && game.getActivePlayersCount() > 1){
    //console.log(game.players)
    for (let player of game.players){
        if (player.active){
            let s = " ";
            if (game.turningPlayer == player.index) {
                s = "*"
            } 
            console.log(s, player.index, ":", player.hand, " --- ",  player.openedCards, "\n")
        }
    }
    console.log("cards:", game.cardsPool.length)
    //print("cards:", game.cardsPool)
    while (true){
        try{
            cardName = document.getElementById("input_card_name").value;
            opponentIndex = None
            // if (game.requiresOpponent(cardName)){
            //     opponentIndex = int(input("Opponent index: "))
            // }
            game.turn(cardName, opponentIndex)
            break
        }catch(e){
        }
    }
}