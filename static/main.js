const socket = io();
let currentGame;
document.querySelector('#create_table_button').onclick = function () {
    document.querySelector('#create_table_form_container').style.display = 'inline';
};

document.querySelector('#create_table_form_button').onclick = function () {
    //let gId = Math.round(Math.random() * (999999 - 100000) + 100000);
    let gId = 1;
    let nick = document.querySelector('#create_table_form_input_name').value;
    socket.emit("new player", gId, nick);
    //console.log(gId);
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
    document.querySelector('#create_table_form_container').style.display = 'none';
};

document.querySelector('#join_table_button').onclick = function () {
    document.querySelector('#join_table_form_container').style.display = 'inline';
};

document.querySelector('#join_table_form_button').onclick = function () {
    let gId = document.querySelector('#join_table_form_input_ID').value;
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
            let str = `<div class="pick_player_players" id="pick_player_players">`;
            for (let i in currentGame.players){
                str += ` <input type="radio" id="pick_player_form_radio1" name="pick_player_form_radio" required class="pick_player_form_radio" value="${currentGame.players[i]._id}"/>
                <label for="pick_player_form_radio1">${currentGame.players[i]._name}</label><br>`;
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
                    }
                };
                if (cardId == 'poice'){} else
                if (cardId == 'sheriff'){} else
                if (cardId == 'witness'){
                    //console.log(currentGame.players[victim].hand[0]);
                    let img = `card_img${currentGame.players[victim].hand[0].rank}.png`;
                    //console.log(img);
                    if (currentGame.players[victim].hand[0].cardClass == 'sheriff'){
                        img = `card_img11.png`;
                    };
                    console.log(document.querySelector('#victim').innerHTML = `<div class="victim_card" 
                                                id="${currentGame.players[victim].hand[0].cardClass}">
                                                <div class="rank">
                                                <p>${currentGame.players[victim].hand[0].rank}</p></div>
                                                <div class="card_img"><img src="./css/${img}"/></div>
                                                <div class="num_of_cards">
                                                <p>${currentGame.players[victim].hand[0].number}</p></div></div>
                                                <input id="close_victim_card_button" class="form_button" 
                                                type="button" value="Ок"/>`
                        );
                    document.querySelector('.victim_card').style.cssText = 'margin-bottom: 25%';
                    document.querySelector('#zatemnenie').style.display = 'inline';
                    document.querySelector('#victim').style.display = 'inline';
                    // document.querySelector('#close_victim_card_button').onclick = function () {
                    //     document.querySelector('#zatemnenie').style.display = 'none';
                    //     document.querySelector('#victim').style.display = 'none';
                    // };
                } else
                if (cardId == 'judge'){} else
                if (cardId == 'killer'){} else
                if (cardId == 'setup'){};
                socket.emit("turn", cardId, victim);
            };
        } else {
            if (cardId == 'lawyer'){} else
            if (cardId == 'godfather'){} else
            if (cardId == 'million'){};
            socket.emit("turn", cardId, victim);
        };
        
    };
};

socket.on("start", (games) => {
    //console.log(document.querySelector("#pick_player_players").elements["pick_player_form_radio"].value);
    let player;
    //let g;
    let gp;
    //console.log(games)
    for (let i in games){
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
        htmlStr += `<div class="player" style="bottom: ${47 - (k * 45)}%">
                    <p class="player_name">${player._name}</p>
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