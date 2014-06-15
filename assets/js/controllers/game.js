

ME.game = {
	bounds : {
		x: {
			min:0, 
			max:$(window).width()
		},
		y: {
			min:0, 
			max:$(window).height()
		}
	},
	start : function()
	{
		ME.ship.draw();
		ME.ship.bind();
		ME.enemies.place();



		$(document).keydown(ME.controls.bindKeysDown);
		$(document).keyup(ME.controls.bindKeysUp);



		ME.game.run();
	},

	stop : function()
	{
		
	},

	pause : function()
	{
		clearInterval(ME.enemies);
		clearInterval(ME.ship.gun.shotLoop);
		clearInterval(ME.shot.handle);	
		clearInterval(ME.controls.ticker);
	},

	run : function()
	{
		ME.enemies.enemiesLoop		=	setInterval(ME.enemies.move,100);
		ME.ship.gun.shotLoop    	= 	setInterval(ME.ship.gun.fireShot,100);
		ME.shot.hitLoop         	= 	setInterval(ME.shot.handle,10);
		ME.controls.movementLoop   	= 	setInterval(ME.controls.ticker,100);
	}
}
