const socket = io();
let gamestate = {};
socket.on('state: ', function (newGamestate) {
  gamestate = newGamestate;
  console.log(gamestate);
});

function setup() {
  createCanvas(400, 800);
  createInput('Enter name').changed(function (e) {
    socket.emit('name', e.target.value);
  });
}

function draw() {
  background(0);
  // let's iterate over the object, using i to move down as we draw
  for (let i = 0; i < Object.keys(gamestate).length; i++) {
    const key = Object.keys(gamestate)[i];
    fill('red');
    // draw a progress bar using the score
    rect(0, 10 * i, gamestate[key].score, 10);
    fill('white');
    // draw the name and score
    text(gamestate[key].name + ' ' + gamestate[key].score, 10, 10 * i + 10);
  }
}

function keyPressed() {
  socket.emit('point');
}
