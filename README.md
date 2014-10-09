AIGame
======

A game for AI Programers to compete against each other

Requirements node.js ( http://www.nodejs.org )

Note for ubuntu users: by default if you install nodejs via "sudo apt-get install nodejs" the node command will be nodejs instead of node, to fix this run "ln -s /usr/bin/nodejs /usr/bin/node"

Install and run
======

git clone https://github.com/tholum/AIGame.git

cd AIGame

node server.js

Actions
======
I added a new actions interface that allows you to execute all actions from a single function. This allows the addition of different inputs into the server with very little code needing to be changed, currently there are 2 interfaces

webserver/action?params

and socket.io socket.emit('action' , params );

Valid Actions are

move         required paramiters = unit , to 

endphase     no paramiters

attack       required paramiters = unit  , target 

build       required paramiters = type , unit , to


unit   : the unit_id of the unit you wish to do the action FROM
to     : the location_id of where you wish to do the action
target : the unit_id of which you wish to do the action


Some examples ( for socket io )

socket.emit( "action" , { action : 'endphase' } );

socket.emit( "action" ,  { action : 'build' , to : '10.26' , type : 'grunt' , unit : 1 } ); 

socket.emit( "action" ,  { action : 'move' , to : '10.27' ,  unit : 3 } );

Routes 
======
Default Server Location [ds] = localhost:8080

[ds]/map     ( Returns the whole world )

[ds]/move?unit=unit_id&to=location_name  ( moves unit unit_id from there current location to location_name )

[ds]/units   ( returns all units )

[ds]/endphase  ( Ends specific phase )

[ds]/attack?unit=unit_id&target=target_unit_id 

[ds]/buildUnit?type=unit_type&unit=unit_id&to=to 

[ds]/action?action=[build,endphase,attack]&{params based on what the action requires}
