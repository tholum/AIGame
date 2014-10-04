var obs = require('obs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/www' ) );
var game = {
    players : { 1 : {name: '' , gold : 100  } , 2 : {name: '' , gold : 100 } },
    turn : 0,
    winner : 0,
    active : true,
    phase : "",
    phases : [ "move","attack","build" ],
    endPhase : function(){
        if( this.phase == this.phases[ this.phases.length -1 ] ){
            this.turn++;
            for( var u in units.units ){
                units.units[u].newTurn();
            } 
            this.phase = this.phases[0];  
        } else {
            this.phases = this.phases[ this.phases.indexOf( this.phase ) + 1 ];
        }
    }
};
//Setting the game to the first phase
game.phase = game.phases[0];

var world = require('./world.js');
var units = require('./units.js');
world.init(game , units );
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
app.get('/buildUnit', function( req , res ){
    var unit = req.param('unit');
    var to = req.param('to')
    world.buildUnit(type,unit,to);
});
app.get('/game' , function( req, res ){
    res.send( game );
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
app.get('/endphase' , function(req,res){
    game.endPhase();
    res.send(game);
});

var base1 = units.createUnit( 'base' );
base1.player = 1;
world.addUnit( base1 , "10.25" );

var base2 = units.createUnit( 'base' );
base2.player = 2;
world.addUnit( base2 , "40.24" );

server.listen(8080);

