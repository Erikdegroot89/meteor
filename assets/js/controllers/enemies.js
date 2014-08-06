/** enemies **/
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
	handleLoss 	: function() // sniff..
	{
		ME.enemies.alive --;
		console.log(ME.enemies.alive, 'left!');
		if(ME.enemies.alive == 0)
			alert('you win!');;   
	},
	alive : 0,

	place : function()	// incoming!
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
		self.enemy_i 	= ME.enemies.alive ;
		
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
		
		ME.enemies.alive  ++;
	}
}