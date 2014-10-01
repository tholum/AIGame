var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname ) );
var world = require('./world.js');
world.init();
var games = {demo : [] };
var history = {};

io.on('connection', function (socket) {
    socket.on('move', function ( move ) {
        var game = move.game;
        var from = move.from;
        var to = move.to;
        games[game].push({ from : from , to : to });
        console.log( games );
        io.sockets.emit('game' + game , { from : from , to : to } );
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
app.get('/world', function(req,res){
	res.send( world.world );
});
server.listen(8080);

