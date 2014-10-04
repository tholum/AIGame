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


Routes 
======
Default Server Location [ds] = localhost:8080

[ds]/map     ( Returns the whole world )

[ds]/move?unit=unit_id&to=location_name  ( moves unit unit_id from there current location to location_name )

[ds]/units   ( returns all units )

[ds]/endphase  ( Ends specific phase )

[ds]/attack?unit=unit_id&target=target_unit_id 

[ds]/buildUnit?type=unit_type&unit=unit_id&to=to 
