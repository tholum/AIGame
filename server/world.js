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
				var name =  x + '.' + y;
				self.world[ name ] = { class : 'grass' , connections : [] };
				if(  y < 50 ){
					self.world[ name ].connections.push( x + "." + (y+1) );
				}
				if(  y != 1 ){
					self.world[ name ].connections.push( x + "." + (y-1) );	
				}
				if( x < 50  ){
					self.world[ name ].connections.push( (x+1) + "." + y );	
				}
				if( x  != 1 ){
					self.world[ name ].connections.push( (x-1) + "." + y );	
				}
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
