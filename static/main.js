const socket = io();
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
     socket.emit("turn", cardId);
}

socket.on("start", (games) => {
    //console.log(games)
    let player;
    let g;
    let gp;
    //console.log(games)
    for (let i in games){
        for (let j in games[i].players){
            if (games[i].players[j]._id == socket.id){
                g = games[i];
                gp = g.players;
            }
        }
    }
    //console.log(gp)
    let htmlStr = ``;
    let k = Object.keys(gp).length - 1;
    for (let id in gp){
        player = gp[id];
        //console.log(player.openedCards)
        htmlStr += `<div class="player" style="bottom: ${47 - (k * 30)}%">
                    <p class="player_name">${player._name}</p>
                    <div class="table_cards">`;
        if (Object.keys(player.openedCards).length == 0){
            htmlStr += `</div></div>`;
        }
        else {
            for (let i in player.openedCards){
                htmlStr += `<div class="table_card" id="${player.openedCards[i].cardClass}" style="right: ${47 - (i * 40)}%">
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
    document.querySelector('#deck').innerHTML = `<p class="deck_num">${Object.keys(g.cardsPool).length}</p>`;
    document.querySelector('#hand').innerHTML = htmlStr;
});