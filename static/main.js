const socket = io();
//const WINDOW_WIDTH = 1000;
//const WINDOW_HEIGTH = 500;

// const canvas = document.getElementById("canvas");
// canvas.width = WINDOW_WIDTH;
// canvas.height = WINDOW_HEIGTH;
// const context = canvas.getContext("2d");
document.querySelector('#create_table_button').onclick = function () {
    document.querySelector('#create_table_form_container').style.display = 'inline';
};

document.querySelector('#create_table_form_button').onclick = function () {
    //let gId = Math.round(Math.random() * (999999 - 100000) + 100000);
    let gId = 1;
    let name = document.querySelector('#create_table_form_input_name').value;
    socket.emit("new player", gId, name);
    console.log(gId);
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
    document.querySelector('#create_table_form_container').style.display = 'none';
};

document.querySelector('#join_table_button').onclick = function () {
    document.querySelector('#join_table_form_container').style.display = 'inline';
};

document.querySelector('#join_table_form_button').onclick = function () {
    let gId = document.querySelector('#join_table_form_input_ID').value;
    let name = document.querySelector('#join_table_form_input_name').value;
    socket.emit("new player", gId, name);
    //socket.emit("new game", gId, {});
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
    document.querySelector('#join_table_form_container').style.display = 'none';
};

document.querySelector(".hand_card").onclick = function() {

}

socket.on("new game", () => {
    socket.emit("new game");
});

socket.on("start", (games, players) => {
    let player;
    for (let id in games[players[socket.id]._gameId].players){
        player = games[players[socket.id]._gameId].players[id];
        //drawPlayer(context, player);
    } 
    //context.beginPath();
    //context.fillText(`My hand: `, WINDOW_WIDTH/2, WINDOW_HEIGTH - 100);
    let i = 1;
    for (let card in players[socket.id].hand){
        const handCard = document.createElement("div");
        handCard.innerHTML = `<p>${players[socket.id].hand[card].rank}</p>`
        // handCard.setAttribute('id', `hand_card#${card + 1}`);
        // handCard.setAttribute('class', 'hand_card');
        // if (players[socket.id].hand[card].card_img == 'card_img11.png' || players[socket.id].hand[card].card_img == 'card_img8.png'){
        //     rank.style.backgroundImage = players[socket.id].hand[card].backGround;
        // } else {
        //     rank.style.backgroundColor = players[socket.id].hand[card].backGround;
        // };
        // const rank = document.createElement("div");
        // rank.setAttribute('class', 'rank');
        // rank.style.color = players[socket.id].hand[card].color;
        // rank.innerHTML = `<p>${players[socket.id].hand[card].rank}</p>`
        // handCard.appendChild(rank);
        // const card_img = document.createElement("div");
        // card_img.setAttribute('class', 'card_img');
        // card_img.innerHTML = `img src="./css/${players[socket.id].hand[card].img}/>`
        // handCard.appendChild(card_img);
        // const num_of_cards = document.createElement("div");
        // num_of_cards.setAttribute('class', 'num_of_cards');
        // num_of_cards.style.color = players[socket.id].hand[card].color;
        // num_of_cards.innerHTML = `<p>${players[socket.id].hand[card].number}</p>`
        // handCard.appendChild(num_of_cards);
        document.getElementById("hand").appendChild(handCard);
        //context.fillText(`${players[socket.id].hand[card].rank}`,  WINDOW_WIDTH/2 + i * 150, WINDOW_HEIGTH - 100);
        i++;
    }
    //context.closePath();
});