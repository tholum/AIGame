module.exports = {
  /* { tileClass : 'base' , connections : [] } */
  world: {},
  on: function(string, func) {
    var self = this;
    if (self.onObj.hasOwnProperty(string)) {
      self.onObj[string].push(func);
    }
  },
  executeOn: function(string, data) {
    var self = this;
    if (self.onObj.hasOwnProperty(string)) {
      for (var f in self.onObj[string]) {
        self.onObj[string][f](data);
      }
    }
  },
  action: function(data) {
    var self = this;
    //move attack endphase
    if (typeof data == "object" && data !== null) {
      console.log(typeof data);
      console.log(data);

      if (data.hasOwnProperty("action")) {
        switch (data.action) {
          case "move":
            if (data.hasOwnProperty("unit") && data.hasOwnProperty("to")) {
              var status = self.moveUnit(
                self.units.units[parseInt(data.unit)],
                data.to
              );
              self.executeOn("action", status);
              return status;
            } else {
              self.executeOn("error", {
                status: "invalid paramiters move",
                data: data
              });
            }

            break;
          case "attack":
            if (data.hasOwnProperty("unit") && data.hasOwnProperty("target")) {
              var status = self.attackUnit(
                self.units.units[parseInt(data.unit)],
                self.units.units[parseInt(data.target)]
              );
              self.executeOn("action", status);
            } else {
              self.executeOn("error", {
                status: "invalid paramiters attack",
                data: data
              });
              return status;
            }
            break;
          case "endphase":
            self.game.endPhase();
            self.executeOn("action", self.game);
            return self.game;
            break;
          case "build":
            if (
              data.hasOwnProperty("type") &&
              data.hasOwnProperty("unit") &&
              data.hasOwnProperty("to")
            ) {
              if (self.units.units.hasOwnProperty(data.unit)) {
                var unit = self.buildUnit(
                  data.type,
                  self.units.units[data.unit],
                  data.to
                );
                self.executeOn("action", unit);
              } else {
                self.executeOn("error", { status: "invalid unit", data: data });
              }
            } else {
              self.executeOn("error", {
                status: "invalid paramiters build",
                data: data
              });
              return status;
            }
            break;
        }
      }
    }
  },
  onObj: {
    action: [],
    phase: [],
    win: [],
    error: []
  },
  tileType: {
    grass: { speed: 1, gold: false },
    gold: { speed: 1, gold: true }
  },
  validateMovement: function(data) {
    var self = this;
    if (
      data.hasOwnProperty("moves") &&
      data.hasOwnProperty("from") &&
      data.hasOwnProperty("to")
    ) {
      if (
        self.world.hasOwnProperty(data.from) &&
        self.world.hasOwnProperty(data.to)
      ) {
        if (
          self.tileType[self.world[data.from].tileClass].speed <= data.moves &&
          self.world[data.from].connections.indexOf(data.to) !== -1 &&
          self.world[data.to].units.length === 0
        ) {
          return {
            success: true,
            moves:
              data.moves - self.tileType[self.world[data.from].tileClass].speed
          };
        } else {
          return {
            success: false,
            errors: {
              speed:
                self.tileType[self.world[data.from].tileClass].speed <=
                data.moves,
              connection:
                self.world[data.from].connections.indexOf(data.to) !== -1
            }
          };
        }
      } else {
        return { success: false };
      }
    } else {
      return { success: false };
    }
  },
  getRange: function(from, to) {
    var self = this;
    if (self.world.hasOwnProperty(from) && self.world.hasOwnProperty(to)) {
      var f = self.world[from];
      var t = self.world[to];
      return Math.sqrt(Math.pow(f.x - t.x, 2) + Math.pow(f.y - t.y, 2));
    } else {
      return false;
    }
  },

  validateRange: function(range, from, to) {
    var self = this;
    var trueRange = self.getRange(from, to);
    return range >= trueRange && trueRange !== false;
  },
  attackUnit: function(unit, target) {
    var self = this;
    if (self.game.phase == "attack") {
      var inRange = self.validateRange(
        unit.range,
        unit.position,
        target.position
      );
      if (inRange) {
        return unit.attack(
          self.getRange(unit.position, target.position),
          target
        );
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  moveUnit: function(unit, to) {
    var self = this;
    if (self.game.phase == "move") {
      var vm = self.validateMovement({
        moves: unit.movesLeft,
        from: unit.position,
        to: to
      });
      console.log(vm);
      var playerTurn = self.game.turn % 2 + 1 == unit.player;
      if (vm.success === true && playerTurn) {
        self.removeUnit(unit);
        unit.movesLeft = vm.moves;
        self.addUnit(unit, to);
        return { success: true };
      } else {
        return {
          success: false,
          error: { moveValid: vm.success, playerTurn: playerTurn }
        };
      }
    }
  },
  buildUnit: function(type, unit, to) {
    console.log("TUT;" + type + "," + unit + ",X:" + to.x + "Y:" + to.y);
    var self = this;
    if (
      self.game.phase == "build" &&
      self.world[unit.position].connections.indexOf(to) !== -1 &&
      unit.canBuild.indexOf(type) !== -1 &&
      self.units.unitTypes[type].cost <= self.game.players[unit.player].gold
    ) {
      var newunit = self.units.createUnit(type);
      newunit.player = parseInt(unit.player);
      self.game.players[unit.player].gold =
        parseInt(self.game.players[unit.player].gold) -
        (parseInt(newunit.cost) == NaN ? 0 : parseInt(newunit.cost));
      return self.addUnit(newunit, to);
    } else {
      console.log("Unit Failed ");
      return false;
    }
  },
  addUnit: function(unit, to) {
    var self = this;
    unit.position = to;
    self.world[unit.position].units.push(unit.id);
    return true;
  },
  removeUnit: function(unit) {
    var self = this;
    var index = self.world[unit.position].units.indexOf(unit.id);
    if (index > -1) {
      self.world[unit.position].units.splice(index, 1);
    }
  },
  generateWorld: function() {
    var self = this;
    var width = 50;
    var height = 50;
    var x = 1;
    var y = 1;

    while (x <= width) {
      while (y <= height) {
        var name = x + "." + y;
        self.world[name] = {
          name: name,
          tileClass: "grass",
          connections: [],
          x: x,
          y: y,
          units: []
        };
        if (y < 50) {
          self.world[name].connections.push(x + "." + (y + 1));
        }
        if (y != 1) {
          self.world[name].connections.push(x + "." + (y - 1));
        }
        if (x < 50) {
          self.world[name].connections.push(x + 1 + "." + y);
        }
        if (x != 1) {
          self.world[name].connections.push(x - 1 + "." + y);
        }
        y++;
      }
      y = 1;
      x++;
    }
    var list = [
      "10.10",
      "10.40",
      "20.20",
      "30.20",
      "40.10",
      "40.40",
      "20.30",
      "30.30"
    ];
    for (var s in list) {
      self.world[list[s]].tileClass = "gold";
    }
  },
  game: {},
  units: {},
  init: function(game, units) {
    var self = this;
    self.game = game;
    self.units = units;
    self.generateWorld();
  }
};
