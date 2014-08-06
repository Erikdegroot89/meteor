

ME.game = {
	score : 100000,
	starttime : new Date().getTime(),
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


		ME.game.drawScore();
		ME.game.run();
	},

	stop : function()
	{
		this.pause();
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

		
	},
	drawScore : function(finished){

		if(finished == true)
		{
			$('#me_container').addClass('game_over');
		}
		$('#scoreList').remove();
		$score_list = $('<ol id="scoreList"></ol>');
		var scores = JSON.parse( localStorage.getItem('scores') );
		console.log(scores);
		if(scores)
		{
			$.each(scores, function(i, item)
			{
				$score_list.append($('<li>'+item.name+': '+item.score+'</li>'));
			});
		}
		$('#me_container').append($score_list);
	},
	addScore : function()
	{
		var end = new Date().getTime();
		var time = end - ME.game.starttime;

		ME.game.score= ME.game.score - time;

		var name = prompt('Yay, you win! Enter your name for the high score!');

		var scores = JSON.parse( localStorage.getItem('scores'));
		var my_score = { 'name' : name,  'score':ME.game.score}
		if(!scores)
		{
			scores = [];
		}

		scores.push(my_score);
		

		localStorage.setItem('scores',JSON.stringify(scores)); 
		ME.game.drawScore(true);
		ME.game.stop();
	}
}

