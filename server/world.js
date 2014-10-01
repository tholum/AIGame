module.exports = {
	/* { class : 'base' , connections : [] } */
	world : {},
	generateWorld : function(){
		var self = this;
		var width = 50;
		var height = 50;
		var x = 1;
		var y = 1;
		while( x <= width ){
			while( y <= height ){
				self.world[ x + '.' + y] = { class : 'grass' , connections : [] };
				y++;
			} 
			y=1;	
			x++;
		}
		var list = [
			"10.10",
			"10.40",
			"20.20",
			"30.20",
			"40.10",
			"40.40",
			"20.30",
			"30.30"
		]
		for( var s in list ){
			self.world[ list[s] ].class = "miniral";
		}
		
	},
	init : function(){
		var self = this;
		self.generateWorld();
		
		
	}
}
