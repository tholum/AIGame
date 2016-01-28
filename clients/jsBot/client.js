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

function checkPosition( units , x , y ){
  var open = true;
  for( var x in units ) {
    if( units[x].position.x == x && units[x].position.y == y ){
      open = false;
    }
  }
  if( x > 50 || y > 50 || x < 0 || y < 0 ){
    open = false;
  }
  return open;
}

function move( position , unit_id , xinc, yinc ){
	return { action : 'move' , to : newPosition( position , xinc , yinc ) , unit : unit_id };
};





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
          var found = false;
          /**
            get all building units
          */
          var bases = [];

          //data.units.units.forEach( function(unit){
          for( unitid in data.units.units ) {
            var unit = data.units.units[unitid];
              if( unit.hasOwnProperty("canBuild") && unit.canBuild.length > 0 && unit.player == 1 ){
                unit.unit_id = unitid;
                bases.push( unit );
              }
          };
          bases.forEach( function(unit){
            var a = newPosition( unit.position , -1 , 0 );
  					for( var x in data.units.units ) {
  						if( data.units.units[x].position == a ){
  							found = true;
  						}
  					}
            if( found == false ){
  						socket.emit( 'action' , { "unit" : unit.unit_id , action : 'build' , type : unit.canBuild[0] , to : a } );
  					}
          });
				}
        socket.emit( 'action' , { action : 'endphase' } );
			break;
      case "move":
      var moveMe = [];

      for( unitid in data.units.units ) {
        var unit = data.units.units[unitid];
          if( unit.player == 1 && unit.movesLeft > 0 ){
            unit.unit_id = unitid;
            moveMe.push( unit );
          }
      };
      moveMe.forEach( function( unit ){
        var validPos = [];
        [[1,0] , [0,1] , [-1,0],[0,-1] ].forEach(function(ckPos){
          var tmpPos = JSON.parse( JSON.stringify(unit.position));
          tmpPos = tmpPos.split(".");
          tmpPos[0] = parseInt( tmpPos[0] ) + ckPos[0];
          tmpPos[1] = parseInt( tmpPos[1] ) + ckPos[1];
          if( checkPosition( data.units.units , tmpPos[0] , tmpPos[1] ) ){
            validPos.push( tmpPos[0] + "." + tmpPos[1] );
          }
        });
        if( validPos.length > 0 ){
          //Randomly pick a position
          var newPos = validPos[ Math.round( Math.random() * 999999 ) % ( validPos.length - 1) ];
          socket.emit( 'action' , { action : 'move' , to : newPos, unit : unit.unit_id } );

        }
      });
      socket.emit( 'action' , { action : 'endphase' } );
      break;
			default:
				setTimeout( function(){socket.emit( 'action' , { action : 'endphase' } ); } , 10 );
			break;
		}
	}
});

socket.on('connect' , function(){
  console.log('Connected');
  socket.emit("getphase" , true );
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
