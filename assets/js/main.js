
//declarations
var wHeight     = $(window).height();
var wWidth     = $(window).width();

var enemy_i 	= 0;
var ME          = {},
	$canvas     = $('#me_container');




ME.rules	= {};
ME.army     = {};
ME.controls = {};
ME.ship     = {};

ME.rules.max_enemies = 10;

ME.controls = {
	ticker : function(ship) // each ship gets a moment ticker function
	{
		ship = ME.ship;
		if(ship.movement.isMoving)
		{
			var loc     = ship.$elem.offset();
			var newLeft = loc.left - (ship.movement.speed * ship.movement.xacc);   
			ship.$elem.css({'-webkit-transform': 'skewY('+ -(ship.movement.speed * ship.movement.xacc)+'deg)'});
			
			if(ship.movement.x < 0)   
			{
				console.log('ship, i am disappoint');
				ship.movement.xacc = 0;
				ship.movement.isAcc = false;
				ship.movement.relocate(1, ship.movement.y);
				// ship.movement.stop();
			}

			if(ship.movement.isAcc)
			{
				ship.movement.xacc ++;
				if(ship.movement.xacc > 10)
				{
					ship.movement.xacc = 10;
				}
			}
			else{
				if(ship.movement.xacc == 0)
				{
					ship.movement.stop();
				}
				else{
					ship.movement.xacc --;    
				}
				
			}
			ship.movement.relocate(newLeft,ME.ship.movement.y);
			

		}

	},
	bindKeysDown : function(e) {

		e = e || window.event;

		switch(e.keyCode) 
		{
			case 37://left arrow
				ME.ship.movement.goLeft(true);
			break;
			case 38:// up arrow
			
			break;
			
			case 39:// right arrow
				ME.ship.movement.goRight(true);
			break;
			case 40://down arrow
			
			break;

			case 17:
			case  32: // space
				ME.ship.gun.isFiring = true;
			break;

		}
	 
	}
	,bindKeysUp : function(e) {

		e = e || window.event;

		switch(e.keyCode) 
		{
			case 37://left arrow
			case 39:// right arrow
				console.log('stahp!');
				ME.ship.movement.brake();
			break;
			case  32:
				ME.ship.gun.isFiring = false;
			break;
		}
	 
	}

};
ME.ship = {
	'$elem'     : null,
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
			this.x2    = x + ship.$elem.width();
			this.y     = y;
			this.y2    = y + ship.$elem.height();
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


		this.movement.relocate((wWidth / 2) - (this.$elem.width()/2), 100);

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




$('#leftBtn').bind('click',function()
{
	// ME.controls.goingLeft = setInterval(function()
	// {
		ME.ship.movement.goLeft();
	// },10);
	
});

/** shots **/
ME.shot = {
	i          : 0,
	collection : new Array(),
	projectile : function(startx, starty)
	{
		// init bullet
		this.bullet_i   =   ME.shot.i;
		this.x          =   startx;
		this.speed      =   2;
		this.y          =   starty;
		this.$shot      =   $('<div class="me_shot"></div>');
		this.damage     =   5;
		this.volatile   =   true;
		this.$shot.css({
			'left'      : startx, 
			'bottom'    : starty
		});

		this.$shot.appendTo($canvas);

		ME.shot.collection.push(this);
		ME.shot.i ++;
		this.explode = function()
		{
			var self = this;
			ME.shot.collection.unset(self.bullet_i);
			self.$shot.addClass('me_shot_exploding');
			self.volatile = false;
			self.$shot.fadeOut(1000).promise().done(function()
			{
				this.remove();
			});
			

				
			
		},
		this.vanish = function()
		{

			var self = this;
			
			ME.shot.collection.unset(self.bullet_i);
			self.$shot.remove();
		}
	},
	handle : function()
	{

		$.each(ME.shot.collection, function(i, bullet)
		{
			if(bullet && bullet.volatile)
			{   
				var newTop = bullet.y + bullet.speed;
				
				bullet.$shot.css('bottom', newTop);
				bullet.y = newTop;
				
				$.each(ME.enemies.collection,function(i, enemy)
				{

					if(enemy && enemy.alive)
					{

						// console.log(newLoc, enemy.loc);
						if(bullet.y > enemy.loc.y && bullet.y < enemy.loc.y2 && enemy.loc.x <= bullet.x && enemy.loc.x2 >= bullet.x)
						{
							
							bullet.explode();
							enemy.handleDamage(bullet.damage);
							
						}
					}
				});

				if(bullet.y >= wHeight)
				{
					bullet.vanish();
				}
			}
		});
	},
	hitLoop : null
}


//    $('#leftBtn').bind('click',function()
// {
//    clearInterval(ME.controls.goingLeft);
	
// });
// 

/** enemies **/


$('.fireBtn').click(function()
{
	ME.ship.gun.fireShot();
});


$('#rightBtn').click(function()
{
	ME.ship.movement.goRight();
});


ME.enemies = {
	move 		: function()
	{
		
		$.each(ME.enemies.collection,function(i,item)
		{

			item.relocate(item.loc.x,item.loc.y - item.speed);
		});
	},
	random		: true,
	collection 	: new Array(),
	handleLoss 	: function()
	{
		ME.army.alive --;
		if(ME.army.alive == 0)
			alert('you win!');;   
	},
	alive : ME.rules.max_enemies,

	place : function()
	{

		var i_collumn 		= 0;
		var i_row 			= 0;
		var distance 		= 100;
		var defaultOffsetY 	= $(window).height() - 100;
		var defaultOffsetX 	= 100;
		// place enemies, staticle
		for(i =0; i < ME.rules.max_enemies; i++)
		{
			var enemy = new this.enemy();
			if(ME.enemies.random)
			{
				var defaultOffsetX = Math.random() * 200;
				var defaultOffsetY 	= $(window).height() + (Math.random() * 200);
				var offsetX  = defaultOffsetX + enemy.$elem.width() + (i_collumn * distance);
				var offsetY  = defaultOffsetY + i_row * distance;
			}else{
				var defaultOffsetX = 100;
				var offsetX  = defaultOffsetX + enemy.$elem.width() + (i_collumn * distance);
				var offsetY  = defaultOffsetY + i_row * distance;

				if(offsetX >= wWidth)
				{
				
					i_row++;
					offsetY = offsetY * i_row;
					i_collumn = 0;
				}
			}
			
			enemy.relocate(offsetX, offsetY);
			this.collection.push(enemy);
			i_collumn ++;
		}
	},

	enemy : function()
	{

		var self 			= this;
		self.size       = 1;
		self.alive 		= true;
		self.enemy_i 	= enemy_i;
		
		self.volatile 	= true;
		self.speed  =   2;
		self.health =   20;
		self.$elem  =   $('<div class="me_enemy"></div>');
		self.$elem.append(self.enemy_i);
		
		self.loc = {
			x      :   0,
			x2     :   0,
			y      :   0,
			y2     :   0
		}
		// self.$elem.width(self.$elem.width() * self.size);
		// self.$elem.height(self.$elem.height() * self.size);

		self.handleDamage = function(amount)
		{
			var self = this;
			self.health -= amount;
			if(self.health <= 0)
			{
				self.explode();
			}
		}

		self.relocate = function(x, y)
		{
			var self = this;
		   
			self.$elem.css({
			'left'      : x, 
			'bottom'    : y
			});

			self.loc = {
				x      :   x,
				x2     :   x + self.$elem.width(),
				y      :   y,
				y2     :   y + self.$elem.height()
			}
		}
		self.explode = function()
		{
			var self = this;
			self.alive = false;

			self.$elem.addClass('me_enemy_exploding');
			
			ME.enemies.collection.unset(self.enemy_i);

			ME.enemies.handleLoss();
			ME.enemies.collection.unset(self.bullet_i);
			
			self.volatile = false;
			self.$elem.fadeOut(1000).promise().done(function()
			{
				this.remove();
			});
			

		}

		// self.relocate(startx, starty);

		self.$elem.appendTo($canvas.find('#enemyContainer'));
		
		enemy_i ++;
	}
}
$(function()
{
	ME.ship.draw();
	ME.ship.bind();
	ME.enemies.place();
	ME.enemiesLoop			=	setInterval(ME.enemies.move,100);
	
});


$(document).keydown(ME.controls.bindKeysDown);
$(document).keyup(ME.controls.bindKeysUp);


ME.ship.gun.shotLoop    = 	setInterval(ME.ship.gun.fireShot,100);
ME.shot.hitLoop         = 	setInterval(ME.shot.handle,10);
ME.movementLoop         = 	setInterval(ME.controls.ticker,100);
