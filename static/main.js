const socket = io();

const WINDOW_WIDTH = 1000;
const WINDOW_HEIGTH = 500;

const canvas = document.getElementById("canvas");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGTH;
const context = canvas.getContext("2d");

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


socket.on("state", (games, players) => {
    //let t = document.createElement("div");
    //t.id = "table_cards";
    let player;
    //console.log('console.log');
    //console.log(players[socket.id]._gameId);
    //console.log(games[players[socket.id]._gameId].players);
    for (let id in games[players[socket.id]._gameId].players){
        player = games[players[socket.id]._gameId].players[id];
        //let c = document.createElement("div");
        //c.id = `p${player._num}_cards`;
       // for (let i in player.hand){
            //c.appendChild(document.createTextNode(`${player.hand[i].number}`));
        //}
       // t.appendChild(document.createTextNode(`Player: ${player._num}`));
       // t.appendChild(c);
        //console.log(player);
        // if (players[id]._id == socket.id){
        //     t = id;
        // }
        drawPlayer(context, player);
    } 
    //document.querySelector('body').appendChild(t);

    context.beginPath();
    context.fillText(`My hand: ${players[socket.id].hand}`, WINDOW_WIDTH/2, WINDOW_HEIGTH - 100)
    context.closePath();
});