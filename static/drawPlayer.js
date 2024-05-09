const drawPlayer = (context, p) => {
    context.beginPath();
    context.fillStyle = "black";
    context.font = "20px sans-serif";
    context.fillText(`Player ${p._name}`, 100, 100 + p._num * 100)
    context.fillText(`Player's cards: ${p.hand}`, 100, 100 + p._num * 100 + 50)
    context.closePath();
}