const socket = io();

const WINDOW_WIDTH = 1000;
const WINDOW_HEIGTH = 500;

const canvas = document.getElementById("canvas");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGTH;
const context = canvas.getContext("2d");

socket.emit("new player");

socket.on("state", (players) => {
    let t;
    for (const id in players){
        const player = players[id];
        // if (players[id]._id == socket.id){
        //     t = id;
        // }
        drawPlayer(context, player);
    } 
    context.beginPath();
    context.fillText(`My hand: ${players[socket.id]._id}`, WINDOW_WIDTH/2, WINDOW_HEIGTH - 100)
    context.closePath();
});