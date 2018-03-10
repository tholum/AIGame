var obs = require("obs");
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
app.use(express.static(__dirname + "/www"));

var world = require("./world.js");
var units = require("./units.js");

var game = {
  players: { 1: { name: "", gold: 100 }, 2: { name: "", gold: 100 } },
  turn: 0,
  player: 1,
  winner: 0,
  active: true,
  phase: "",
  phases: ["move", "attack", "build"],
  phaseEnd: []
};
game.endPhase = function() {
  var self = game;
  if (self.phase == self.phases[self.phases.length - 1]) {
    self.turn++;

    for (var u in units.units) {
      units.units[u].newTurn();
    }
    self.phase = self.phases[0];
  } else {
    self.phase = self.phases[self.phases.indexOf(self.phase) + 1];
  }
  game.player = game.turn % 2 + 1;
  for (var x in self.phaseEnd) {
    self.phaseEnd[x]();
  }
};
//Setting the game to the first phase
game.phase = game.phases[0];

game.phaseEnd.push(function() {
  world.executeOn("phase", game);
});
world.on("action", function(data) {
  console.log("Action Ran");
  console.log(data);
});
world.on("error", function(data) {
  console.log("error");
  console.log(data);
});
world.on("phase", function() {
  console.log("phase ended");
});
world.on("phase", function() {
  if (game.phase == game.phases[0]) {
    var player = game.turn % 2 + 1;
    for (var u in units.units) {
      var unit = units.units[u];
      if (world.world.hasOwnProperty(unit.position)) {
        var tileClass = world.world[unit.position].tileClass;
        if (
          unit.player == player &&
          unit.collector == true &&
          tileClass == "gold"
        ) {
          game.players[player].gold = parseInt(game.players[player].gold) + 10;
        }
      }
    }
  }
});
world.init(game, units);
units.init(game);
var games = { demo: [] };
var history = {};

io.on("connection", function(socket) {
  socket.on("joinGame", function(game) {
    for (id in games[game]) {
      socket.emit("game" + game, games[game][id]);
    }
  });
  socket.on("action", function(data) {
    world.action(data);
  });
});
io.sockets.on("connection", function(socket) {
  world.on("action", function(data) {
    socket.emit("action", data);
  });
  world.on("win", function(data) {
    socket.emit("win", data);
  });
  world.on("phase", function() {
    socket.emit("phase", { game: game, units: units });
  });
  socket.on("map", function(data) {
    if (typeof data == "string" && world.world.hasOwnProperty(data)) {
      socket.emit("map", world.world[data]);
    } else {
      socket.emit("map", world.world);
    }
  });
  socket.on("getphase", function() {
    socket.emit("phase", { game: game, units: units });
  });
  socket.on("game", function(data) {
    socket.emit("game", game);
  });
  socket.on("units", function(data) {
    socket.emit("units", units.units);
  });
});
app.use((req, res, next) => {
  let match = req.originalUrl.match(/\/([a-z]*)/);
  let api = match !== null ? match[1] : "none";

  let player = req.param("player");
  if (
    game.player == player ||
    ["game", "map", "units", "none"].indexOf(api) !== -1
  ) {
    next();
  } else {
    res.send({
      api,
      error: `Player ${player} not allowed to do action ${api} for ${
        game.player
      }`
    });
  }
});

app.get("/game", function(req, res) {
  res.send(game);
});
app.get("/map", function(req, res) {
  res.send(world.world);
});

app.get("/buildUnit", function(req, res) {
  var unit = req.param("unit");
  var to = req.param("to");
  var type = req.param("type");
  res.send(world.action({ action: "build", type: type, unit: unit, to: to }));
});
app.get("/action", function(req, res) {
  var query = require("url").parse(req.url, true).query;
});

app.get("/units", function(req, res) {
  let cleanUnits = {};
  for (let key of Object.keys(units.units)) {
    if (units.units[key].alive === true) {
      cleanUnits[key] = units.units[key];
    }
  }
  res.send(cleanUnits);
});
app.get("/move", function(req, res) {
  var unit = req.param("unit");
  var to = req.param("to");
  res.send(world.action({ action: "move", unit: unit, to: to }));
});
app.get("/attack", function(req, res) {
  let tmp = require("url").parse(req.url, true).query;
  tmp.action = "attack";
  let result = world.action({
    action: "attack",
    target: tmp.target,
    unit: tmp.unit
  });
  [1, 2].forEach(id => {
    if (units.units[id].alive === false) {
      game.winner = units.units[id].player === 1 ? 2 : 1;
      game.active = false;
    }
  });
  res.send(result);
});
app.get("/endphase", function(req, res) {
  res.send(world.action({ action: "endphase" }));
});

var base1 = units.createUnit("base");
base1.player = 1;
world.addUnit(base1, "10.25");

var base2 = units.createUnit("base");
base2.player = 2;
world.addUnit(base2, "40.24");

server.listen(8080);
