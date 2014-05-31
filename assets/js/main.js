
var wHeight     = $(window).height();
var wWidth     = $(window).width();
var bullet_i    = 0;
var enemy_i 	= 0;
var ME          = {},
    $canvas     = $('#me_container');



ME.shots    = new Array();
ME.enemies  = new Array();
ME.army = {};

ME.max_enemies = 10;
ME.controls = {
    ticker : function(ship)
    {
        ship = ME.ship;
        if(ship.movement.isMoving)
        {
            var loc     = ship.$elem.offset();
            var newLeft = loc.left - (ship.movement.speed * ship.movement.xacc);   

            
            ship.movement.relocate(newLeft,ME.ship.movement.y);
            

        }

    },
    bindKeysDown : function(e) {

        e = e || window.event;

        switch(e.keyCode) 
        {
            case 37://left arrow
                console.log('test');
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
            case  32:
                ME.ship.fireShot();
            break;

        }
     
    }
    ,bindKeysUp : function(e) {

        e = e || window.event;

        switch(e.keyCode) 
        {
            case 37://left arrow
            case 39:// right arrow
                console.log('stopping!');
                ME.ship.movement.stop();
                // ME.ship.movement.goLeft(true);
            break;
        }
     
    }

};
ME.ship = {
    '$elem'     : null,
    movement : {
        'speed' : 2,
        x       : 0,
        x2		: 0,
        y       : 0,
        y2		: 0,
        xacc    : 0,
        isMoving: false,
        relocate : function(x,y)
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
        goLeft  : function()
        {
            if(this.isMoving)
                return;
            this.xacc++;

            ship = ME.ship;   
            ship.$elem.addClass('jsMovingLeft');
            
            this.isMoving = true;
           
        },
        goRight : function()
        {
            if(this.isMoving)
                return;
             this.xacc --;

            ship = ME.ship;   
            ship.$elem.addClass('jsMovingRight');
           
            this.isMoving = true;
           
        },
        stop : function()
        {
            this.xacc = 0;
            ship.$elem
                .removeClass('jsMovingRight')
                .removeClass('jsMovingLeft');
            this.isMoving = false;
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
    

    fireShot : function()
    {
        var shot = new ME.shot((this.movement.x+ this.movement.x2) / 2, this.movement.y2);
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

ME.shot = function(startx, starty)
{
    console.log(startx,starty);
    this.bullet_i   =   bullet_i;
    this.x          =   startx;
    this.speed      =   5;
    this.y          =   starty;
    this.$shot      =   $('<div class="me_shot"></div>');
    
    this.$shot.css({
        'left'      : startx, 
        'bottom'    : starty
    });

    this.$shot.appendTo($canvas);

    ME.shots.push(this);
    bullet_i ++;
    this.explode = function()
    {
        var self = this;
        ME.shots.shift(self.bullet_i);
        self.$shot.addClass('me_shot_exploding');

        setTimeout(function()
        {
           self.$shot.remove();
        },100);
    },
    this.vanish = function()
    {
        var self = this;
        ME.shots.shift(self.bullet_i);
        self.$shot.remove();
    }
}

ME.handleshots = function()
{

    $.each(ME.shots, function(i, bullet)
    {
        if(bullet)
        {   
            var newTop = bullet.y + bullet.speed;
            
            bullet.$shot.css('bottom', newTop);
            bullet.y = newTop;
            
            $.each(ME.enemies,function(i, enemy)
            {

                if(enemy && enemy.alive)
                {

                    // console.log(newLoc, enemy.loc);
                    if(bullet.y > enemy.loc.y && bullet.y < enemy.loc.y2 && enemy.loc.x <= bullet.x && enemy.loc.x2 >= bullet.x)
                    {
                        
                        bullet.explode();
                        enemy.explode();
                        
                    }
                }
            });

            if(bullet.y >= wHeight)
            {
                bullet.vanish();
            }
        }
    });
    
}


//    $('#leftBtn').bind('click',function()
// {
//    clearInterval(ME.controls.goingLeft);
    
// });
// 

/** enemies **/

ME.enemy = function()
{
	self 			= this;
	self.alive 		= true;
	self.enemy_i 	= enemy_i;
	self.loc = {};
	
	self.speed  =   5;
	self.$elem  =   $('<div class="me_enemy"></div>');
	self.$elem.append(self.enemy_i);
	
	self.loc = {
		x      :   0,
		x2     :   0,
		y      :   0,
		y2     :   0
	}

	self.relocate = function(x, y)
	{
		self = this;
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
		self = this;
		console.log(self.alive);
		self.alive = false;

		self.$elem.addClass('me_enemy_exploding');
		
		ME.enemies.shift(self.enemy_i);
	}

	// self.relocate(startx, starty);

	self.$elem.appendTo($canvas.find('#enemyContainer'));
	
	enemy_i ++;
}

$('.fireBtn').click(function()
{
    ME.ship.fireShot();
});


$('#rightBtn').click(function()
{
    ME.ship.movement.goRight();
});



ME.hitLoop      = setInterval(ME.handleshots,10);
ME.movementLoop = setInterval(ME.controls.ticker,10);



ME.army.place = function()
{

    var i_collumn = 0;
    var i_row = 0;
    var distance = 100;
    var defaultOffsetY = 300;
    var defaultOffsetX = 100;
    // place enemies, staticle
    for(i =0; i < ME.max_enemies; i++)
    {
    	var enemy = new ME.enemy();
    	var offsetX  = defaultOffsetX + enemy.$elem.width() + (i_collumn * distance);
    	var offsetY  = defaultOffsetY + i_row * distance;
    	
    	if(offsetX >= wWidth)
    	{
    	
    		i_row++;
    		offsetY = offsetY * i_row;
    		i_collumn = 0;
    	}
    	
    	enemy.relocate(offsetX, offsetY);
    	ME.enemies.push(enemy);
    	i_collumn ++;
    }
}

$(function()
{
	ME.ship.draw();
	ME.ship.bind();
    ME.army.place();
	
});
$(document).keydown(ME.controls.bindKeysDown);
$(document).keyup(ME.controls.bindKeysUp);