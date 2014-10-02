module.exports = {
	init : function(){},
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
			unit.player = 0;
			unit.id = parseInt( self.currentId );
			//adding these as functions so we can latter create special units and upgrade 
			unit.takeHit = function( hitValue ){ this.hp = this.hp - hitValue; this.alive = this.hp > 0 ? true : false; }
			//adding these as functions so we can latter create special units and upgrade 
			unit.attack = function( range , unitType ){ return this.range >= range ? 0 : this.damage;}
		}
		self.units[unit.id] = unit;
		return unit;
	},
	unitTypes : {
		'grunt' : { hp : 20 , speed : 1 , range : 1 , damage : 10 , missChance : 0 , actions : 2 },
		'archer': { hp : 10 , speed : 1 , range : 2 , damage : 10 , missChance : 0 , actions : 2 },
		'base'	: { hp : 200 , speed : 0 , range : 0 , damage : 0 , missChance : 0 , actions : 1 }
	}
}
