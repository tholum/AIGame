var ml = require('ml-js');

var io = require('socket.io-client'),

socket = io.connect('http://localhost:8080', {
    port: 8080
});

function newPosition( position , xinc , yinc ){
	var pos = position.split(".");
	var x = parseInt( pos[0] );
	var y = parseInt( pos[1] );
	x = x + xinc;
	y = y + yinc;
	return x + "." + y;
}

function move( position , unit_id , xinc, yinc ){
	return { action : 'move' , to : newPosition( position , xinc , yinc ) , unit : unit_id }; 
};



socket.on('connect' , function(){console.log('Connected')});
	socket.on('action' , function(data){
		console.log( data );		
	});	
	socket.on('phase' , function( data ){
		console.log( 'phase' );
		console.log( data );
		if( data.game.player == 2 ){
			socket.emit( 'action' , { action : 'endphase' } );
		} else {
			switch( data.game.phase ){
				case "build":
					if( data.game.players[1].gold >= 50 ){
						var a = newPostition( data.units[0].position , -1 , 0 );
						var found = false;
						for( var x in data.units ){
							if( data.units[x].position == a ){
								found = true;
							}
						}
						if( found == false ){
							socket.emit( 'action' , { action : 'build' , unit : 1 , to : a } );
						}
						socket.emit( 'action' , { action : 'endphase' } );
					}						
				break;
				case "move":
					
				break;
			}
		}
	});
/*
function mainFunction(){

}
var f = new mainFunction();

qValues = new ml.CSDAQValues({ actions : [] , nb_actions );
/*
ml = require 'ml-js'

myprocess = new SomeProcess

qValues = new ml.CSDAQValues nb_features, nb_actions

options = {
  learning_rate: 0.1
  discount_factor: 0.9
  exploration_policy: new ml.BoltzmannExploration 0.2 # temperature
}
agent = new ml.QLearningAgent qValues, options

myprocess.on 'do_something', (currentState)->
  next_action = agent.getAction currentState
  myprocess.do next_action

myprocess.on 'feedback_received', (initState, action, newState, reward)->
    agent.learn initState, action, newState, reward


*/
