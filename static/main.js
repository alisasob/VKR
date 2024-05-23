const socket = io();
let currentGame;
let currentGames = [];
document.querySelector('#create_table_button').onclick = function () {
    document.querySelector('#create_table_form_container').style.display = 'inline';
};

document.querySelector('#create_table_form_button').onclick = function () {
    let gId = '' + Math.round(Math.random() * (999999 - 100000) + 100000);
    //console.log(currentGames);
    //let gId = 1;
    let nick = document.querySelector('#create_table_form_input_name').value;
    socket.emit("new player", gId, nick);
    //console.log(gId);
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
    document.querySelector('#create_table_form_container').style.display = 'none';
};

document.querySelector('#join_table_button').onclick = function () {
    let str = ``;
    for (let i in currentGames){
        str += ` <input type="radio" id="join_table_form_radio" name="join_table_form_radio" 
                required class="join_table_form_radio" value="${currentGames[i]}"/>
                <label for="pick_player_form_radio">${currentGames[i]}</label><br>`;
    };
    document.querySelector('#join_table_form_button').insertAdjacentHTML('beforebegin', str);
    document.querySelector('#join_table_form_container').style.display = 'inline';
};

document.querySelector('#join_table_form_button').onclick = function () {
    //console.log('im in click')
    let gId;
    let els = document.getElementsByName('join_table_form_radio');
    for (let i in els){
        if (els[i].checked){
            gId = els[i].value;
            break;
        };
    };
    //console.log('gId: ', gId)
    let nick = document.querySelector('#join_table_form_input_name').value;
    socket.emit("new player", gId, nick);
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
    document.querySelector('#join_table_form_container').style.display = 'none';
};


function turnClick(cardId) {
    if (currentGame.turningPlayer == socket.id){
        let victim;
        if (['police', 'sheriff', 'witness', 'judge', 'killer', 'setup'].includes(cardId)){
            let players = [];
            for (let i in currentGame.players){
                if (currentGame.players[i].active && !currentGame.players[i].protected && 
                    (cardId == 'killer' || currentGame.players[i]._id != currentGame.turningPlayer)){
                    players.push(currentGame.players[i]);
                };
            };
            //console.log(players);
            if (Object.keys(players).length == 0){
                victim = currentGame.turningPlayer;
                if (cardId == 'killer' || cardId == 'setup'){
                    let c;
                        if (currentGame.players[socket.id].hand[0].cardClass == 'killer') {
                            c = currentGame.players[socket.id].hand[1].rank;
                        } else {
                            c = currentGame.players[socket.id].hand[0].rank;
                        };
                        if (c == 7){
                            document.querySelector('#comment').innerHTML = '<p>Некорректный ход!</p>';
                            document.querySelector('#zatemnenie').style.display = 'inline';
                            document.querySelector('#comment').style.display = 'inline';
                            document.querySelector('#zatemnenie').onclick = function () {
                                document.querySelector('#zatemnenie').style.display = 'none';
                                document.querySelector('#comment').style.display = 'none';
                            };
                            return;
                        } else {
                            if (currentGame.players[socket.id].hand[0].cardClass == 'setup') {
                                c = currentGame.players[socket.id].hand[1].rank;
                            } else {
                                c = currentGame.players[socket.id].hand[0].rank;
                            };
                            if (c == 7){
                                document.querySelector('#comment').innerHTML = '<p>Некорректный ход!</p>';
                                document.querySelector('#zatemnenie').style.display = 'inline';
                                document.querySelector('#comment').style.display = 'inline';
                                document.querySelector('#zatemnenie').onclick = function () {
                                    document.querySelector('#zatemnenie').style.display = 'none';
                                    document.querySelector('#comment').style.display = 'none';
                                };
                                return;
                            };
                        };
                };
                socket.emit("turn", cardId, victim);
            } else {
                let str = `<div class="pick_player_players" id="pick_player_players">`;
                for (let i in players){
                        str += ` <input type="radio" id="pick_player_form_radio1" name="pick_player_form_radio" 
                                required class="pick_player_form_radio" value="${players[i]._id}"/>
                                <label for="pick_player_form_radio1">${players[i]._name}</label><br>`;
                };
                str += `</div>
                        <input id="pick_player_form_button" class="form_button" type="button" value="Ок"/>`;
                document.querySelector('#pick_player_form').innerHTML = str;
                document.querySelector('#zatemnenie').style.display = 'inline';
                document.querySelector('#pick_player_form').style.display = 'inline';
                document.querySelector('#pick_player_form_button').onclick = function () {
                    document.querySelector('#pick_player_form').style.display = 'none';
                    document.querySelector('#zatemnenie').style.display = 'none';
                    let els = document.getElementsByName('pick_player_form_radio');
                    for (let i in els){
                        if (els[i].checked){
                            victim = els[i].value;
                            break;
                        };
                    };
                    if (cardId == 'police'){
                        document.querySelector('#zatemnenie').style.display = 'inline';
                        document.querySelector('#pick_card_form').innerHTML = `<input name="pick_card_form_input"
                          id="pick_card_form_input" class="card_input" type="text" placeholder="Номинал карты (от 2 до 8)"
                          minlength="1" maxlength="1"/>
                        <input id="pick_card_form_button" class="form_button" type="button" value="Ок"/>`;
                        document.querySelector('#pick_card_form').style.display = 'inline';
                        document.querySelector('#pick_card_form_button').onclick = function () {
                            let value;
                            document.querySelector('#pick_card_form').style.display = 'none';
                            document.querySelector('#zatemnenie').style.display = 'none';
                            value = document.querySelector('#pick_card_form_input').value;
                            if (currentGame.players[victim].hand[0].rank != value || value == 1){
                                victim = socket.id;
                            }
                            socket.emit("turn", cardId, victim);
                        }
                    } else
                    if (cardId == 'sheriff'){
                        document.querySelector('#zatemnenie').style.display = 'inline';
                        document.querySelector('#pick_card_form').innerHTML = `<input name="pick_card_form_input"
                                                id="pick_card_form_input" class="card_input" type="text" placeholder="Номинал карты (от 2 до 8)"
                                                minlength="1" maxlength="1"/>
                                                <input id="pick_card_form_button" class="form_button" type="button" value="Ок"/>`;
                        document.querySelector('#pick_card_form').style.display = 'inline';
                        document.querySelector('#pick_card_form_button').onclick = function () {
                            let value;
                            document.querySelector('#pick_card_form').style.display = 'none';
                            document.querySelector('#zatemnenie').style.display = 'none';
                            value = document.querySelector('#pick_card_form_input').value;
                            if (currentGame.players[victim].hand[0].rank != value || value == 1){
                                document.querySelector('#zatemnenie').style.display = 'inline';
                                document.querySelector('#continue_form').innerHTML = `
                                                <p>Попробуете угадать ещё раз?</p>
                                                <input id="continue_form_no" class="form_button" type="button" value="Нет"/>
                                                <input id="continue_form_yes" class="form_button" type="button" value="Да"/>`;
                                document.querySelector('#continue_form').style.display = 'inline';
                                document.querySelector('#continue_form_yes').onclick = function () {
                                    document.querySelector('#continue_form').style.display = 'none';
                                    document.querySelector('#pick_card_form').innerHTML = `<input name="pick_card_form_input"
                                                id="pick_card_form_input" class="card_input" type="text" placeholder="Номинал карты (от 2 до 8)"
                                                minlength="1" maxlength="1"/>
                                                <input id="pick_card_form_button" class="form_button" type="button" value="Ок"/>`;
                                    document.querySelector('#pick_card_form').style.display = 'inline';
                                    document.querySelector('#pick_card_form_button').onclick = function () {
                                        document.querySelector('#pick_card_form').style.display = 'none';
                                        document.querySelector('#zatemnenie').style.display = 'none';
                                        value = document.querySelector('#pick_card_form_input').value;
                                        if (currentGame.players[victim].hand[0].rank != value || value == 1){
                                            victim = 'death';
                                            //console.log("if of death", victim)
                                            socket.emit("turn", cardId, victim);
                                        };
                                    };
                                };
                                document.querySelector('#continue_form_no').onclick = function () {
                                    document.querySelector('#continue_form').style.display = 'none';
                                    document.querySelector('#zatemnenie').style.display = 'none';
                                    victim = socket.id;
                                    socket.emit("turn", cardId, victim);
                                }
                            } else{
                                socket.emit("turn", cardId, victim);
                            };
                        }
                    } else
                    if (cardId == 'witness'){
                        let img = `card_img${currentGame.players[victim].hand[0].rank}.png`;
                        if (currentGame.players[victim].hand[0].cardClass == 'sheriff'){
                            img = `card_img11.png`;
                        };
                        document.querySelector('#victim').innerHTML = `<div class="victim_card" 
                                                    id="${currentGame.players[victim].hand[0].cardClass}">
                                                    <div class="rank">
                                                    <p>${currentGame.players[victim].hand[0].rank}</p></div>
                                                    <div class="card_img"><img src="./css/${img}"/></div>
                                                    <div class="num_of_cards">
                                                    <p>${currentGame.players[victim].hand[0].number}</p></div></div>`;
                        document.querySelector('.victim_card').style.cssText = 'margin-bottom: 25%';
                        document.querySelector('#zatemnenie').style.display = 'inline';
                        document.querySelector('#victim').style.display = 'inline';
                        document.querySelector('#zatemnenie').onclick = function () {
                            document.querySelector('#zatemnenie').style.display = 'none';
                            document.querySelector('#victim').style.display = 'none';
                            socket.emit("turn", cardId, victim);
                        };
                    } else
                    if (cardId == 'judge'){
                        socket.emit("turn", cardId, victim);
                    } else
                    if (cardId == 'killer'){
                        let c;
                        if (currentGame.players[socket.id].hand[0].cardClass == 'killer') {
                            c = currentGame.players[socket.id].hand[1].rank;
                        } else {
                            c = currentGame.players[socket.id].hand[0].rank;
                        };
                        if (c == 7){
                            document.querySelector('#comment').innerHTML = '<p>Некорректный ход!</p>';
                            document.querySelector('#zatemnenie').style.display = 'inline';
                            document.querySelector('#comment').style.display = 'inline';
                            document.querySelector('#zatemnenie').onclick = function () {
                                document.querySelector('#zatemnenie').style.display = 'none';
                                document.querySelector('#comment').style.display = 'none';
                            };
                            return;
                        };
                        socket.emit("turn", cardId, victim);
                    } else
                    if (cardId == 'setup'){
                        let c;
                        if (currentGame.players[socket.id].hand[0].cardClass == 'setup') {
                            c = currentGame.players[socket.id].hand[1].rank;
                        } else {
                            c = currentGame.players[socket.id].hand[0].rank;
                        };
                        if (c == 7){
                            document.querySelector('#comment').innerHTML = '<p>Некорректный ход!</p>';
                            document.querySelector('#zatemnenie').style.display = 'inline';
                            document.querySelector('#comment').style.display = 'inline';
                            document.querySelector('#zatemnenie').onclick = function () {
                                document.querySelector('#zatemnenie').style.display = 'none';
                                document.querySelector('#comment').style.display = 'none';
                            };
                            return;
                        };
                        socket.emit("turn", cardId, victim);
                    };
                };
            };
        } else {
            if (cardId == 'lawyer'){} else
            if (cardId == 'godfather'){} else
            if (cardId == 'million'){};
            socket.emit("turn", cardId, victim);
        };
        
    };
};

socket.on("new gId", (cGames) => {
    currentGames = cGames;
    //console.log('its notWORKING $%%^%*&*')
    //console.log(currentGames)
});

socket.on("start", (games) => {
    //console.log(document.querySelector("#pick_player_players").elements["pick_player_form_radio"].value);
    let player;
    //let g;
    let gp;
    //console.log(games)
    for (let i in games){
        for (let j in currentGames){
            if (i == currentGames[j]){
                currentGames.splice(j, 1)
            }
        }
        for (let j in games[i].players){
            if (games[i].players[j]._id == socket.id){
                currentGame = games[i];
                gp = currentGame.players;
            }
        }
    }
    let htmlStr = ``;
    let k = Object.keys(gp).length - 1;
    for (let id in gp){
        player = gp[id];
        //console.log(player.openedCards)
        let color = '#ede9b9';
        if (currentGame.turningPlayer == player._id){
            color = 'green';
        };
        if (player.active == false){
            color = 'red';
        }
        htmlStr += `<div class="player" style="bottom: ${47 - (k * 45)}%">
                    <p class="player_name" style="text-shadow: ${color} 0 0 5px">${player._name}</p>
                    <div class="table_cards">`;
        if (Object.keys(player.openedCards).length == 0){
            htmlStr += `</div></div>`;
        }
        else {
            for (let i in player.openedCards){
                htmlStr += `<div class="table_card" id="${player.openedCards[i].cardClass}" style="right: ${47 - (i * 55)}%">
                                    <div class="rank"><p>${player.openedCards[i].rank}</p></div>
                                    <div class="num_of_cards"><p>${player.openedCards[i].number}</p></div>
                                </div>`
            };  
            htmlStr += `</div></div>`;
        };
        k--;           
    } ;
    document.querySelector('#players').innerHTML = htmlStr;
    //console.log(htmlStr);
    htmlStr = ``;
    let img;
    k = Object.keys(gp[socket.id].hand).length - 1;
    k *= -1; 
    for (let card in gp[socket.id].hand){
        img = `card_img${gp[socket.id].hand[card].rank}.png`;
        //console.log(img);
        if (gp[socket.id].hand[card].cardClass == 'sheriff'){
            img = `card_img11.png`;
        }
        htmlStr += `<div class="hand_card" id="${gp[socket.id].hand[card].cardClass}" style="left: ${k*10}%;" onClick="turnClick(this.id)">
                    <div class="rank">
                    <p>${gp[socket.id].hand[card].rank}</p></div>
                    <div class="card_img"><img src="./css/${img}"/></div>
                    <div class="num_of_cards">
                    <p>${gp[socket.id].hand[card].number}</p></div>
                    </div>`
        k += 2;
    }
    document.querySelector('title').innerHTML = gp[socket.id]._name;
    document.querySelector('#deck').innerHTML = `<p class="deck_num">${Object.keys(currentGame.cardsPool).length}</p>`;
    document.querySelector('#hand').innerHTML = htmlStr;
});

socket.on("end", (winner) => {
    document.querySelector('#comment').innerHTML = `<p>Игра окончена!</p><p>Победил ${currentGame.players[winner]._name}!</p>`;
                             document.querySelector('#zatemnenie').style.display = 'inline';
                             document.querySelector('#comment').style.display = 'inline';
    
});