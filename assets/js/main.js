
//declarations
var ME          = {},
$canvas     = $('#me_container');




ME.rules	= {};
ME.enemies  = {};
ME.controls = {};
ME.ship     = {};
ME.shot     = {};
ME.game		= {};

ME.rules.max_enemies = 10;
yepnope({
	load: [
		'assets/js/controllers/controls.js',
		'assets/js/controllers/ship.js',
		'assets/js/controllers/enemies.js',
		'assets/js/controllers/shots.js',
		'assets/js/controllers/game.js',
	],
	complete	: function()
	{
		
		
		ME.controls.bind();
		ME.game.start();
	}
});



