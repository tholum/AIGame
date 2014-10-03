
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/www' ) );
var game = {
    players : { 1 : '' , 2 : '' },
    turn : 0,
    endTurn : function(){
        this.turn++;
        for( var u in units.units ){
            units.units[u].newTurn();
        }
    }
};

var world = require('./world.js');
var units = require('./units.js');
world.init(game);
units.init(game);
var games = {demo : [] };
var history = {};




io.on('connection', function (socket) {
    socket.on('move', function ( move ) {
	var unit = move.unit;
	var to = move.to;
	var status = world.moveUnit( units.units[parseInt(unit)] , to );
        io.sockets.emit('move'  , { unit : unit , to : to , status : status } );
    });
    socket.on('joinGame' , function(game){
        for( id in games[game]  ){
            socket.emit('game' + game , games[game][id] );
        }
        
    });
    socket.on('listGames' , function(){
        for( game in games ){
            socket.emit('avalibleGames' , game);
        }
    });
    socket.on('createGame' , function(name){
       games[name] = []; 
       io.sockets.emit('avalibleGames' , { add : name });
    });
    socket.on('resetGame' , function(game){
        games[game] = [];
        io.sockets.emit('game' , {reset : true });
    });
    socket.on('chat' , function(chat){
        io.sockets.emit('chat' , chat );
    });
});
app.get('/map', function(req,res){
	res.send( world.world );
});
app.get('/units', function(req,res){
	res.send( units.units );
});
app.get('/move' ,  function(req,res){
    var unit = req.param('unit');
    var to = req.param('to')
    var status = world.moveUnit( units.units[parseInt(unit)] , to );
    res.send(  { unit : unit , to : to , status : status } );
});
app.get('/attack' , function(req,res){
    var unit = req.param('unit');
    var target  = req.param('target');
    world.attachUnit( units.units[parseInt(unit)] , units.units[parseInt(target)] );
});
app.get('/endturn' , function(req,res){
    game.endTurn();
    res.send(game);
});
var g1 = units.createUnit('grunt');
g1.player = 1;
world.addUnit( g1 , '1.1');
g1.takeHit( 5 );
g1.movesLeft = 10;
server.listen(8080);

