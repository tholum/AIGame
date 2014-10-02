module.exports = {
	init : function(){},
	createUnit : function( type ){
		var self = this;
		var unit = false;
		if( self.unitTypes.hasOwnProperty( type ) ){
			unit = JSON.parse(JSON.stringify(self.unitTypes[type]));
			unit.alive = true;
			//adding these as functions so we can latter create special units and upgrade 
			unit.takeHit = function( hitValue ){ this.hp = this.hp - hitValue; this.alive = this.hp > 0 ? true : false; }
			//adding these as functions so we can latter create special units and upgrade 
			unit.attack = function( range , unitType ){ return this.range >= range ? 0 : this.damage;}
		}
		return unit;
	},
	unitTypes : {
		'grunt' : { hp : 20 , speed : 1 , range : 1 , damage : 10 , missChance : 0 },
		'archer': { hp : 10 , speed : 1 , range : 2 , damage : 10 , missChance : 0 },
		'base'	: { hp : 200 , speed : 0 , range : 0 , damage : 0 , missChance : 0 }
	}
}
