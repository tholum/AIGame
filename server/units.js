module.exports = {
	init : function(){},
	createUnit : function( type ){
		var c = this;
		unit = function(t){
			
		}
		return c( type );
	},
	unitTypes : {
		'grunt' : { hp : 20 , speed : 1 , range : 1 , damage : 10 },
		'archer': { hp : 10 , speed : 1 , range : 2 , damage : 10 },
		'base'	: { hp : 200 , speed : 0 , range : 0 , damage : 0 }
	}
}
