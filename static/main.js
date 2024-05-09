const socket = io();

const WINDOW_WIDTH = 1000;
const WINDOW_HEIGTH = 500;

const canvas = document.getElementById("canvas");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGTH;
const context = canvas.getContext("2d");

document.querySelector('#create_table_button').onclick = function () {
    let gId = Math.round(Math.random() * (999999 - 100000) + 100000);
    socket.emit("new player", gId);
    console.log(gId);
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
};

document.querySelector('#join_table_button').onclick = function () {
    document.querySelector('#join_table_form_container').style.display = 'inline';
};

document.querySelector('#join_table_form_button').onclick = function () {
    let gId = document.querySelector('#join_table_form_input_ID').value;
    socket.emit("new player", gId);
    // alert(gId);
    //socket.emit("new game", gId, {});
    document.querySelector('#zatemnenie').style.display = 'none';
    document.querySelector('dialog').close();
    document.querySelector('#join_table_form_container').style.display = 'none';
};


socket.on("state", (games, players) => {
    let t;
    for (let id in games[players[socket.id]._gameId].players){
        const player = games[players[socket.id]._gameId].players[id];
        // if (players[id]._id == socket.id){
        //     t = id;
        // }
        drawPlayer(context, player);
    } 
    context.beginPath();
    context.fillText(`My hand: ${players[socket.id]._id}`, WINDOW_WIDTH/2, WINDOW_HEIGTH - 100)
    context.closePath();
});