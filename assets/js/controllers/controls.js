ME.controls = {
	ticker : function(ship) // each ship gets a moment ticker function
	{
		ship = ME.ship;
		if(ship.movement.isMoving)
		{
			var loc     = ship.$elem.offset();
			var newLeft = loc.left - (ship.movement.speed * ship.movement.xacc);   
			ship.$elem.css({'-webkit-transform': 'skewY('+ -(ship.movement.speed * ship.movement.xacc)+'deg)'});
			
			if(ship.movement.x < ME.game.bounds.x.min)   
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
	 
	},
	place : function()
	{
		var $controls = $(
				'<div class="controlContainer">'+
                '<div id="leftBtn" class="controlBtn">&larr;/div>'+
                '<div id="rightBtn" class="controlBtn">&rarr;</div>'+
                '<div id="midBtn" class="controlBtn fireBtn">fire</div></div>'
                );
		$('#me_container').append($controls);
	},
	bind : function()
	{

		$('#leftBtn').bind('click',function(){ME.ship.movement.goLeft});
		$('#rightBtn').bind('click',ME.ship.movement.goRight);
		$('.fireBtn').click(ME.ship.gun.fireShot);
		$(document).keydown(this.bindKeysDown);
		$(document).keyup(this.bindKeysUp);
	}

};