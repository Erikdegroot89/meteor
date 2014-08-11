ME.ship = {
	'$elem'     : null,
	size		: {width: 50,height:70},
	movement : {
		speed   : 2,                // velocity of ship
		x       : 0,                // (bottom left) position as set by dom
		x2		: 0,                // (bottom right) -
		y       : 0,                // top left -
		y2		: 0,                // top right -
		xacc    : 0,                // acceleration due to input buttons
		xaccFactor : 0,
		
		isAcc   : false,            // is accelerating boolean
		isMoving: false,            // is moving boolean
		willListenForInput : true,  // allow input to manipulate acceleration
		
		relocate : function(x,y) // basic movement
		{


			ship = ME.ship;
			ship.$elem.css({
				'left'      : x,
				'bottom'    : y
			});
			this.x     = x;
			this.x2    = x + 40;
			this.y     = y;
			this.y2    = y + 40;
		},
		goLeft  : function() // steer left
		{

			if(!this.willListenForInput)
				return;
			console.log('going left');
			this.speed = 2;
			
			this.isAcc      = true;
			this.isMoving   = true;
			this.willListenForInput = false;
		   
		},
		goRight : function()
		{
			
			if(!this.willListenForInput)
				return;
			console.log('going right'); 
			this.speed = -2;  
			
			this.isAcc      = true;
			this.isMoving   = true;
			this.willListenForInput = false;
		   
		},
		brake : function()
		{
			this.isAcc = false;
			this.speed = this.speed *0.8;
			this.willListenForInput = true;
		},
		stop : function()
		{
			this.speed = 0;
			this.isMoving = false;
			this.willListenForInput = true;
		}
	},
	
	
	'draw'      : function()
	{
		this.$elem = $('<div>')
		.addClass('me_ship')
		.appendTo($canvas);


		this.movement.relocate( (ME.game.bounds.x.max / 2) - (this.size.width/2), 10);

	},
	bind    : function()
	{

	},
	
	gun : {
		isFiring : false,
		fireShot : function()
		{
			
			if (ME.ship.gun.isFiring)
			{
				var ship =ME.ship;
				var shot = new ME.shot.projectile((ship.movement.x+ ship.movement.x2) / 2, ship.movement.y2);
			}
		},
		shotInterval : null

	}
}