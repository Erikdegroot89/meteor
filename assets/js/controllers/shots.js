
/** shots **/
ME.shot = {
	i          : 0,
	collection : new Array(),
	projectile : function(startx, starty)
	{
		// init bullet
		this.bullet_i   =   ME.shot.i;
		this.x          =   startx;
		this.speed      =   4;
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

				if(bullet.y >= ME.game.bounds.y.max)
				{
					bullet.vanish();
				}
			}
		});
	},
	hitLoop : null
}
