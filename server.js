const express = require('express');
const {Server} = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 3000;

// we'll store the entire game state in this object
// keys will be socket.id's and values will be objects
// with a 'score' key and a 'name' key
const gamestate = {};

io.on('connection', function (socket) {
  console.log('a user connected');

  // handle new 'point' messages
  socket.on('point', function () {
    if (gamestate[socket.id] == undefined) {
      // if we haven't recorded this players score yet (new player)
      // initialize their score
      gamestate[socket.id] = {score: 0};
    }
    // we got a new point so increment the score
    gamestate[socket.id].score = gamestate[socket.id].score + 1;
    // io.emit sends to everyone; socket.emit sends to just the sender
    // in this case we want everyone to know the new score
    io.emit('state: ', gamestate);
  });

  // handle new 'name' messages
  socket.on('name', function (name) {
    gamestate[socket.id].name = name;
    // inform everyone
    io.emit('state: ', gamestate);
  });
});

// serve the current directory ('.') as static files
// i.e. so index.html, sketch.js can be downloaded normally
app.use(express.static('.'));

server.listen(port, function () {
  console.log('Game app listening on port ' + port);
});
