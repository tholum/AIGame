module.exports = {
    game : {},
	init : function(game){ this.game = game; },
	currentId : 0,
	units : {},
	createUnit : function( type ){
		var self = this;
		self.currentId++;
		var unit = false;
		if( self.unitTypes.hasOwnProperty( type ) ){
			unit = JSON.parse(JSON.stringify(self.unitTypes[type]));
			unit.alive = true;
			unit.position = "";
			unit.movesLeft = 0;
			unit.actionsLeft = 0;
			unit.player = 0;

            unit.type = type;
			unit.id = parseInt( self.currentId );
			//adding these as functions so we can latter create special units and upgrade
			unit.takeHit = function( hitValue , unit , range ){
                this.hp = this.hp - hitValue;
                this.alive = this.hp > 0 ? true : false;
                if( self.type == "base" && self.alive == false ){
                    self.game.winner = unit.player;
                    self.game.active = false;
                }
                return { damage : hitValue , isAlive : this.alive , hp : this.hp }
            }
			//adding these as functions so we can latter create special units and upgrade
			unit.attack = function( range , target ){
                if( range <= this.range ){
                    return target.takeHit( this.damage , this , range );
                }
            }
			unit.newTurn = function(){
        self.units[unit.id].movesLeft = parseInt( self.units[unit.id].speed ); self.units[unit.id].actionsLeft = parseInt(self.units[unit.id].actions);
      };
		}
		self.units[unit.id] = unit;
		return unit;
	},
	unitTypes : {
		'grunt' : { hp : 20 , speed : 1 , range : 1 , damage : 10 , missChance : 0 , actions : 2 , canBuild : [] , cost : 50  , collector : true },
		'archer': { hp : 10 , speed : 1 , range : 2 , damage : 10 , missChance : 0 , actions : 2 , canBuild : [] , cost : 50 , collector : false },
		'base'	: { hp : 200 , speed : 0 , range : 0 , damage : 0 , missChance : 0 , actions : 1 , canBuild : ['grunt' , 'archer' ] , collector : false}
	}
}
