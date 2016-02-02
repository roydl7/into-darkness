var ver = "0.2a"
var canvas;
var ctx;

//Const
var maxBackgroundsIMG = 14;
var maxAsteroidsIMG = 10; 

//Images
var falcon, falcon2;
var background;
var bullet_img;
var explosionsprite = [];
var meteorsprite = [];
var wormhole = [];

//Explosion
var explosion_radius = [192/2, 256];
var explosion_imgw = [192, 256];
var explosion_size = [1, 3.0];
var explosions = [];

//Falcon Coords
var falcon_w = 100, falcon_h = 100;
var falcon_x, falcon_y;
var falcon_vx = 0, falcon_vy = 0;
var falcon_tvx = 0, falcon_tvy = 0;
var falcon_fa = 90, falcon_tfa = 90;
var falconEnabled = false;
var falconInvincible = false;

//Objects
var bullets = [];
var meteors = [];

var asteroid_radius = 20;
var asteroids = [];
var asteroids_lastbelt = 0, meteor_lastshower = 0;

var last_shot = 0;

//Audio Elements
var sound;
var music;

var acc = 0;

//Stats
var stats_destroyed = 0;
var stats_deaths = 0;
var stats_gameStartAt = 0;
var stats_timeAlive = 0;
var stats_lives = 3;
var stats_finalScore = 0;

var destroyed_asteroids = [];
var destroyed_meteors = [];

var footerData;

//System
var debugEnabled = true;
var gameStarted = false;
var gameOver = false;
var keys = [];
var lastCalledTime, fps, lastFPSUpdate = 0;
var canvasShake = false;
var music_muted = false;
var sound_muted = false;
var defaultAlpha = 0.9; 
var assetsLoaded = 0;
var gameLoaded = false;
var preLoadBackgrounds = 0, preLoadAsteroids = 0;
var controlsEnabled = false;

var tek_email = "user@user.com", tek_fname = "user";

var start;
var tint;


var engineOn = true;

var wormholeAngle = 0;
var wormholeTransitionDirection = 1;
var wormholeTransitionInProgress = false;
var wormholeTransition = 0;
var wormhole_x, wormhole_y;
var wormholeEnabled = false; 
var wormhole_last = 20000;
var wormholeSize = 150;
var wormholeCloseTimer;
var wormholeImg = 0;

//Wormhole Transition
var transitionDirection = 1;
var transitionValue = 0;
var transitionInProgress = false;

//Global Transition
var globalTransitionDirection = 1;
var globalTransitionValue = 0;
var globalTransitionInProgress = false;



window.addEventListener("load", initialize);

function initialize() {
	$.ajax("ajax/connect.php", {
		type: "post",
		success: function (response) {
				preload();
		},
		error: function () {
				$("#loadertext").text("Connection Failed.");
		}
	});
}


function gameScreenProceed() 
{
	if(!gameOver) {
					$("#loader").fadeIn();
					$("#loadertext").text("Starting new game...");
					gameStarted = true;

					$.post("ajax/stats.php", { action: 'start_gameplay_session' },  function(data) {
						
						falcon_x = canvas.width/2;
						falcon_y = canvas.height/2;
						falcon_fa = 90;
						falconEnabled = true;
						falconInvincible = false;
						globalTransitionInProgress = true;
						globalTransitionDirection = 1;
						controlsEnabled = true;
						stats_deaths = stats_destroyed = 0;
						stats_lives = 3;
						stats_gameStartAt = meteor_lastshower = asteroids_lastbelt = new Date().getTime();
						asteroids.splice(0, asteroids.length);
						meteors.splice(0, meteors.length);
				
						$("#loader").fadeOut();
					});
	
					
				} else {
					gameOver = false;
					controlsEnabled = false;
				}
	
}
function preload() {
	
	canvas = document.getElementById("game");
	ctx = canvas.getContext("2d");
	
	document.addEventListener("keydown", function(e) {
		
		if(gameLoaded) {
			if(!gameStarted && e.keyCode == 13) {
				gameScreenProceed();
			}
			keys[e.keyCode] = true;
			if(e.keyCode == 32 && falconEnabled && !falconInvincible) {
				if(new Date().getTime() - last_shot > 180) {	
					shoot();
					last_shot = new Date().getTime();
				}
			}
		}
	});
	
	document.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
		
	});
	
	//canvas.width  = window.innerWidth - ((5/100)*window.innerWidth);
	//canvas.height = window.innerHeight - ((5/100)*window.innerHeight);
	
	canvas.width = 1366;
	canvas.height = 768;
	
	falcon_x = canvas.width/2;
	falcon_y = canvas.height/2;
	
	music = document.createElement("audio");
	music.src = "game/audio/interstellar.mp3";
	music.oncanplaythrough = onAssetLoad;
	music.volume = 1;
	music.loop = true;
	music.play();
		
	background = document.createElement("img");
	background.onload = onAssetLoad;
	background.src = "game/images/backgrounds/background" + Math.floor(Math.random() * maxBackgroundsIMG) + ".jpg";
	
	falcon = new Image();
	falcon.onload = onAssetLoad;
	falcon.src = "game/images/mfalcon.png";
	
	falcon2 = new Image();
	falcon2.onload = onAssetLoad;
	falcon2.src = "game/images/mfalconacc.png";
	
	bullet_img = new Image();
	bullet_img.onload = onAssetLoad;
	bullet_img.src = "game/images/bullet.png";
	
	explosionsprite[0] = new Image();
	explosionsprite[0].onload = onAssetLoad;
	explosionsprite[0].src = "game/images/explosion_sprite.png";
	explosionsprite[1] = new Image();
	explosionsprite[1].onload = onAssetLoad;
	explosionsprite[1].src = "game/images/explosion2_sprite.png";
	
	
	meteorsprite[0] = new Image();
	meteorsprite[0].onload = onAssetLoad;
	meteorsprite[0].src = "game/images/asteroids/meteorspritedown.png";
	meteorsprite[1] = new Image();
	meteorsprite[1].onload = onAssetLoad;
	meteorsprite[1].src = "game/images/asteroids/meteorspriteup.png";
	meteor_lastshower = new Date().getTime();
	
	wormhole[0] = new Image();
	wormhole[0].onload = onAssetLoad;
	wormhole[0].src = "game/images/wormhole1.png";
	wormhole[1] = new Image();
	wormhole[1].onload = onAssetLoad;
	wormhole[1].src = "game/images/wormhole2.png";
	wormhole_last = new Date().getTime(); //needed for initial delay of wormhole
	
	
	start = new Image();
	start.onload = onAssetLoad;
	start.src = "game/images/start.png";
	gameStarted = false;
	
	end = new Image(); 
	end.onload = onAssetLoad;
	end.src = "game/images/end.png";
	
	tint = new Image(); 
	tint.onload = onAssetLoad;
	tint.src = "game/images/tint.png";
	
	
	setInterval(function() { 
		$.post("ajax/stats.php", { action: 'get_stats' },  function(data) {
			$("#toggle-leaderboard").css('display', 'block');
			footerData = JSON.parse(data);
			updateLeaderboard(footerData);
		});
	}, 5000);
	
	render();
	   
}


function asteroid_belt(data) {
	var asteroid_data = JSON.parse(data);
	var asteroid_id_cnt = 0;
	
	for(var i = 0; i < 5; i++) {
		var ax = canvas.width + 100;
		var ay = Math.floor(Math.random() * canvas.height);
		var aa = 110 - Math.floor(Math.random() * 150);
		var af = new Image();
		af.src = "game/images/asteroids/asteroid (" + (Math.floor(Math.random() * maxAsteroidsIMG)) + ").png";
		var asteroid = { angle: aa, x: ax, y: ay, uid: asteroid_data[asteroid_id_cnt++], img: af, size: 1 + Math.random()};
		asteroids.push(asteroid);
	}
	
	for(var i = 0; i < 5; i++) {
		var ax = - 100;
		var ay = Math.floor(Math.random() * canvas.height);
		var aa = 240 - Math.floor(Math.random() * 150);
		var af = new Image();
		af.src = "game/images/asteroids/asteroid (" + (Math.floor(Math.random() * maxAsteroidsIMG)) + ").png";
		var asteroid = { angle: aa, x: ax, y: ay, uid: asteroid_data[asteroid_id_cnt++], img: af, size: 1 + Math.random()};
		asteroids.push(asteroid);
	}
}

function meteor_shower(data) {
	
	var meteor_data = JSON.parse(data);

	var ax = falcon_x;
	var ay = +10;
	var aa = -90;
	var ty = 0;
	if(falcon_y > canvas.height/2) {
		ay = -10;
		aa = -90;
		ty = 0;
	} else {
		ay = canvas.height + 10;
		aa = 90;
		ty = 1;
	}
	var meteor = { angle: aa, x: ax, y: ay, uid: meteor_data.meteor, frameid: 0, type: ty};
	meteors.push(meteor);

}


function render() {
	
	requestAnimationFrame(render);
	
	if(!gameLoaded) return;
	
	
	checkBounds();
	
	if(new Date().getTime() - asteroids_lastbelt > 5000) {
		asteroids_lastbelt = new Date().getTime(); //set time right over here, the delay causes this part to exec multiple times
		$.post("ajax/stats.php", { action: 'generate_asteroids' },  function(data) {
			asteroid_belt(data);
		});
	
	}
	 
	if(new Date().getTime() - meteor_lastshower > 15000) {
		meteor_lastshower = new Date().getTime();
		$.post("ajax/stats.php", { action: 'generate_meteor' },  function(data) {
			meteor_shower(data);
		});
	}
	
	if(new Date().getTime() - wormhole_last > 25000 && gameStarted) {
		wormholeTransition = 0;
		wormholeTransitionInProgress = true;
		wormholeTransitionDirection = 0;
		wormhole_x = 100 + (Math.random() * (canvas.width - 200));
		wormhole_y = 100 + (Math.random() * (canvas.height - 200));
		wormhole_last = new Date().getTime();
		wormholeEnabled = true;
		wormholeImg = Math.floor(Math.random() * 2);
		wormholeCloseTimer = setTimeout("closeWormhole()", 7000);
	}
	
	if(wormholeTransitionInProgress) {
		wormholeTransition = wormholeTransitionDirection == 0 ? wormholeTransition + 1 : wormholeTransition - 1;
		if(wormholeTransitionDirection == 0  && wormholeTransition > wormholeSize - 1) 	wormholeTransitionInProgress = false;
		if(wormholeTransitionDirection == 1  && wormholeTransition < 1) wormholeEnabled = wormholeTransitionInProgress = false;
	}
	
	falcon_fa -= keys[37] == true ? 5 : 0;
		falcon_tfa = falcon_fa = falcon_fa < -360 ? 0 : falcon_fa;
	
	falcon_fa += keys[39] == true ? 5 : 0;
		falcon_tfa = falcon_fa = falcon_fa > 360 ? 0 : falcon_fa;
	
	
	if(keys[38] == true && controlsEnabled) {
		acc = 3;
		accelerate(); 
	}
	
	
	
	move();
	drawBackground();
	
	if(wormholeEnabled) drawWormhole();

	if(falconEnabled) drawFalcon();
	
	render_objects();
	
	//Wormhole Transition
	if(transitionInProgress) {
		transitionValue = transitionDirection == 1 ? transitionValue + 0.05 : transitionValue - 0.05;
		falcon_w = transitionDirection == 1 ? falcon_w - 5 : falcon_w + 5;
		falcon_h = transitionDirection == 1 ? falcon_h - 5 : falcon_h + 5; //There might be a problem here if frames are skipped? (resizing the falcon back to normal), add reset width and height to original values when transition is complete
		
		drawBlackBG(transitionValue);
		if(transitionValue < 0.01) transitionInProgress = false;
		if(transitionValue > 0.99) {
			background.src = "game/images/backgrounds/background" + Math.floor(Math.random() * maxBackgroundsIMG) + ".jpg";
			transitionDirection = 0;
			
			asteroids.splice(0, asteroids.length);
			meteors.splice(0, meteors.length);
		
		}
	}
	
	//GLOBAL Transition
	if(globalTransitionInProgress) {
		globalTransitionValue = globalTransitionDirection == 1 ? globalTransitionValue + 0.05 : globalTransitionValue - 0.05;
		drawBlackBG(globalTransitionValue);
		if(globalTransitionValue < 0.01) globalTransitionInProgress = false;
		if(globalTransitionValue > 0.99) globalTransitionDirection = 0;
	}
	
	if(gameStarted) {
		drawScore();
		drawLives();
		drawFooter();
		
	}
	
	if(!gameStarted) 
	{
		ctx.globalAlpha = 0.01;
		ctx.drawImage(background, 0, 2);
		ctx.drawImage(background, 0, 1);
		ctx.drawImage(background, 0, 0);
		ctx.drawImage(background, 0, -1);
		ctx.drawImage(background, 0, -2);
		ctx.globalAlpha = defaultAlpha;
		
		if(!gameOver) {
			ctx.drawImage(tint, 0, 0, canvas.width, canvas.height);
			ctx.drawImage(start, 0, 0, canvas.width, canvas.height);
		} else {
			ctx.drawImage(end, 0, 0, canvas.width, canvas.height);
			ctx.font = 'bold 35pt Arial';
			ctx.fillStyle = '#87E1FF';
			ctx.textAlign = "center"; 
			ctx.strokeStyle = 'black';
			ctx.fillText("Asteroids destroyed: " + stats_destroyed, canvas.width/2, canvas.height/2 + 50);
			//ctx.strokeText("Asteroids destroyed: " + stats_destroyed, canvas.width/2, canvas.height/2 + 50);
			
			ctx.fillText("Time Alive: " + stats_timeAlive + " seconds", canvas.width/2, canvas.height/2);
			//ctx.strokeText("Time Alive: " + stats_timeAlive + " seconds", canvas.width/2, canvas.height/2);
			
			//ctx.fillText("Score: " + Math.ceil((Math.round(stats_timeAlive)/60)* stats_destroyed/2),  canvas.width/2+60, canvas.height/2+100);
			ctx.fillText("Score: " + stats_finalScore,  canvas.width/2, canvas.height/2+100);
			//ctx.strokeText("Score: " + stats_finalScore,  canvas.width/2, canvas.height/2+100);

			ctx.textAlign = "left"; 
		} 
	}
	
	
	if(debugEnabled) debug();

	delta = (new Date().getTime() - lastCalledTime)/1000;
	if(new Date().getTime() - lastFPSUpdate > 100) {
			fps = 1/delta;
			lastFPSUpdate = Date.now();
	}
	lastCalledTime = Date.now();
	
	
	if(keys[76]) {
		//Interface.js
		showLeaderboard();
	} else hideLeaderboard();
}

function drawBackground() {
	if(canvasShake) {
		ctx.drawImage(background, Math.random() * 5 + 0.1 * (-1920/2 - falcon_x + canvas.width/2), Math.random() * 5 + 0.1 *(-1200/2 - falcon_y + canvas.height/2));
	} else 
	ctx.drawImage(background, 0.1 * (-1920/2 - falcon_x + canvas.width/2), 0.1 *(-1200/2 - falcon_y + canvas.height/2));
}

function drawWormhole() {
	ctx.save();
	ctx.translate(wormhole_x,  wormhole_y);
	ctx.rotate(wormholeAngle += 0.4  * Math.PI/180);
	ctx.drawImage(wormhole[wormholeImg], -wormholeTransition/2, -wormholeTransition/2, wormholeTransition, wormholeTransition);
	ctx.restore();
	
}

function drawFalcon() {
	ctx.save();
	ctx.translate(falcon_x, falcon_y);
	ctx.rotate((falcon_fa - 90) * Math.PI/180);
	
	if(falconInvincible && new Date().getTime()%2 == 0) ctx.globalAlpha = 0.1;
	
	ctx.drawImage(keys[38] == true && engineOn ? falcon2 : falcon, -falcon_w/2, -falcon_h/2, falcon_w, falcon_h);
	
	ctx.restore();
	ctx.globalAlpha = defaultAlpha;
}



function shoot() {
	var bullet = { angle: falcon_fa, x: falcon_x, y: falcon_y };
	bullets.push(bullet);
	
	if(!sound_muted) {
		sound = document.createElement("audio");
		sound.src = "game/audio/pew.mp3";
		sound.volume = 0.1;
		sound.play();
	}
}

function render_objects() {
	for(var i = 0; i < bullets.length; i++) {
		bullets[i].x = bullets[i].x - 5* Math.cos(bullets[i].angle * Math.PI/180);
		bullets[i].y = bullets[i].y - 5* Math.sin(bullets[i].angle * Math.PI/180);
		
		ctx.save();
		ctx.translate(bullets[i].x, bullets[i].y);
		ctx.rotate((bullets[i].angle+90) * Math.PI/180);
		
		ctx.drawImage(bullet_img, -15, -15, 30, 30);
		ctx.restore();	
		
		if(isOutOfBounds(bullets[i].x, bullets[i].y))	{
			var index = bullets.indexOf(bullets[i]);
			bullets.splice(index, 1);
		}
	}
	
	
	for(var i = 0; i < asteroids.length; i++) {
		asteroids[i].x = asteroids[i].x - 4* Math.cos(asteroids[i].angle * Math.PI/180);
		asteroids[i].y = asteroids[i].y - 4* Math.sin(asteroids[i].angle * Math.PI/180);
		var current_asteroid_radius = asteroid_radius * asteroids[i].size;
		ctx.drawImage(asteroids[i].img, asteroids[i].x - current_asteroid_radius, asteroids[i].y - current_asteroid_radius, current_asteroid_radius * 2, current_asteroid_radius * 2);
		
		if(debugEnabled) {
			ctx.font = '10pt Courier New';
			ctx.fillText("x: " + Math.round(asteroids[i].x, 1) + " y: " + Math.round(asteroids[i].y, 1) + " a: " + Math.round(asteroids[i].angle, 1) + " id: " + asteroids[i].uid, asteroids[i].x, asteroids[i].y);
		}
		
		if(isOutOfBounds(asteroids[i].x, asteroids[i].y)) {
			var index = asteroids.indexOf(asteroids[i]);
			asteroids.splice(index, 1);
		}
	} 

	for(var i = 0; i < meteors.length; i++) {
		meteors[i].x = meteors[i].x - 5* Math.cos(meteors[i].angle * Math.PI/180);
		meteors[i].y = meteors[i].y - 5* Math.sin(meteors[i].angle * Math.PI/180);
		
		if(debugEnabled) {
			ctx.font = '10pt Courier New';
			ctx.fillText("x: " + Math.round(meteors[i].x, 1) + " y: " + Math.round(meteors[i].y, 1) + " id: " + meteors[i].uid, meteors[i].x, meteors[i].y);
		}
		
		var sx = -20;
		var sy = 512 * meteors[i].frameid++;
		meteors[i].frameid = meteors[i].frameid > 5 ? 0 : meteors[i].frameid + 0;
		
		ctx.drawImage(meteorsprite[meteors[i].type], sx, sy, 512, 512, meteors[i].x - 48, meteors[i].y - 48, 96, 96);

		
		var current_meteor_status = true;
		
		
		if(isOutOfBounds(meteors[i].x, meteors[i].y)) {
			var index = meteors.indexOf(meteors[i]);
			meteors.splice(index, 1);
			continue;
		}
		
		//Bullet-Meteor Collision
		for(var j = 0; j < bullets.length; j++) {
			current_meteor_status = true;
			if(inRange(meteors[i].x, meteors[i].y, bullets[j].x, bullets[j].y, 15) && !falconInvincible) {
				
				destroyed_meteors.push(meteors[i].uid);
				
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "game/audio/explosion" + ((i+j)%2==0?1:2) + ".mp3";
					sound.volume = 0.2;
					sound.play();
				}
	
				canvasShake = true;
				setTimeout(function() { canvasShake = false; }, 500);
	
				explosions.push({ x:meteors[i].x, y:meteors[i].y, spriteid: 0, type: 0 });
				meteors.splice(meteors.indexOf(meteors[i]), 1);
				bullets.splice(bullets.indexOf(bullets[j]), 1);
				current_meteor_status = false;
				
				stats_destroyed += 2;
				break;
			}
		}
		
		if(!current_meteor_status) continue;
		
		//Falcon-Meteor Collision
		if(inRange(falcon_x, falcon_y, meteors[i].x, meteors[i].y, 30) && falconEnabled && !falconInvincible) {
				

				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "game/audio/explosion3.mp3";
					sound.volume = 0.4;
					sound.play();
				}
				
				canvasShake = true;
				setTimeout(function() { canvasShake = false; }, 3000);
	
				explosions.push({ x:meteors[i].x, y:meteors[i].y, spriteid: 0, type: 1 });
				meteors.splice(meteors.indexOf(meteors[i]), 1);
				
				stats_deaths++;
				
				onFalconDeath();
				break;
		}
		
	} 
	
	for(var i = 0; i < asteroids.length; i++) {
		
		var current_asteroid_status = true; //Dont call Falcon-Asteroid if asteroid was destroyed by a bullet
		
		//Bullet-Asteroid Collision
		for(var j = 0; j < bullets.length; j++) {
			if(inRange(asteroids[i].x, asteroids[i].y, bullets[j].x, bullets[j].y, 15 * asteroids[i].size) && !falconInvincible) {
				
				
				
				destroyed_asteroids.push(asteroids[i].uid);
				
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "game/audio/explosion" + ((i+j)%2==0?1:2) + ".mp3";
					sound.volume = 0.2;
					sound.play();
				}
	
	
				canvasShake = true;
				setTimeout(function() { canvasShake = false; }, 500);
	
				explosions.push({ x:asteroids[i].x, y:asteroids[i].y, spriteid: 0, type: 0 });
				asteroids.splice(asteroids.indexOf(asteroids[i]), 1);
				bullets.splice(bullets.indexOf(bullets[j]), 1);
				current_asteroid_status = false;
				
				stats_destroyed++;
				break;
			}
		}
		
		if(!current_asteroid_status) continue;
		
		//Falcon-Asteroid Collision
		if(inRange(falcon_x, falcon_y, asteroids[i].x, asteroids[i].y, 30 * asteroids[i].size) && falconEnabled && !falconInvincible) {
				

				
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "game/audio/explosion3.mp3";
					sound.volume = 0.4;
					sound.play();
				}
				
				canvasShake = true;
				setTimeout(function() { canvasShake = false; }, 3000);
	
				explosions.push({ x:asteroids[i].x, y:asteroids[i].y, spriteid: 0, type: 1 });
				asteroids.splice(asteroids.indexOf(asteroids[i]), 1);
				
				stats_deaths++;
				onFalconDeath();
				break;
		}
		
	}
		
	//Falcon-Wormhole Collision
	if(inRange(falcon_x, falcon_y, wormhole_x, wormhole_y, wormholeSize/3) && wormholeEnabled && Math.floor(wormholeTransition) == Math.floor(wormholeSize)) {
			wormholeEnabled = false;
			transitionInProgress = true;
			transitionDirection = 1;
			
			clearInterval(wormholeCloseTimer);
	}

	for(var i = 0; i < explosions.length; i++) {
		var type = explosions[i].type;
		ctx.drawImage(explosionsprite[type], explosion_imgw[type] * explosions[i].spriteid, 0, explosion_imgw[type], explosion_imgw[type], explosions[i].x - (explosion_imgw[type]/2) * explosion_size[type], explosions[i].y - (explosion_imgw[type]/2) * explosion_size[type], explosion_imgw[type] * explosion_size[type], explosion_imgw[type] * explosion_size[type]);
		if(explosions[i].spriteid++ > 64) {
			explosions.splice(explosions.indexOf(explosions[i]), 1);
		}
	}
}


function accelerate() {
	if(!engineOn) return;
	
	//get target x-velocity & y-velocity
	falcon_tvx = -acc * Math.cos(falcon_fa * Math.PI/180);
	falcon_tvy = -acc * Math.sin(falcon_fa * Math.PI/180);
	
	//increment/decrement actual x-vel & y-vel to target x-velocity & y-velocity smoothly if accelerate is pressed
	if(falcon_tvx != falcon_vx || falcon_tvy  != falcon_vy) {
		falcon_vx += falcon_vx < falcon_tvx ? 0.2: -0.2;
		falcon_vy += falcon_vy < falcon_tvy ? 0.2: -0.2;
	}
}



function move() {
	falcon_x += falcon_vx;
	falcon_y += falcon_vy;
}

function closeWormhole() {
	wormholeTransitionDirection = 1;
	wormholeTransitionInProgress = true;
}

function drawBlackBG(a) {
	ctx.globalAlpha = a;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = defaultAlpha;
}


function checkBounds() {
	var hit = false;
	if(falcon_x > canvas.width - falcon_w/2 || falcon_x < falcon_w/2) {
		falcon_vx = -falcon_vx;
		hit = true;
	} 	
	
	if(falcon_y > canvas.height - falcon_h/2 || falcon_y < falcon_h/2)	{
		falcon_vy = -falcon_vy;
		hit = true;
	}
	if(hit) {
		
		console.log("OUTTABOUNDS! " + Math.random());
		engineOn = false;
		setTimeout(function() { engineOn = true; }, 150);
	}
}

function isOutOfBounds(x, y) {
	return x > canvas.width + 200 || x < -200 || y > canvas.height + 200 || y < -200;
}

function inRange(x, y, px, py, radius) {
	return (x > px - radius && x < px + radius && y > py - radius && y < py + radius);
}

function onFalconDeath() {
	falconInvincible = true;
	$("#loader").fadeIn();
	$("#loadertext").text(stats_lives - 1 > 0 ? "Respawning..." : "Processing...");
	
	stats_lives--;
	
	$.post("ajax/stats.php", { action: 'on_death', 'destroyed_uids[]': destroyed_asteroids, 'destroyed_muids[]': destroyed_meteors },  function(data) {
		var gamedata = JSON.parse(data); //parseInt((JSON.parse(data)).d);	
		stats_lives = parseInt(gamedata.d);
		
		if(stats_lives < 1) {

			falconInvincible = true;
			falconEnabled = false;
			
			stats_timeAlive = parseInt(gamedata.a);//(new Date().getTime() - stats_gameStartAt)/1000;
			stats_destroyed = parseInt(gamedata.s);
			stats_finalScore = parseInt(gamedata.f);
			
			saveInfo();

			setTimeout(function () {
				globalTransitionInProgress = true;
				globalTransitionDirection = 1;
				setTimeout("gameOverOverlay()", 400);
			}, 1000);
			
			destroyed_asteroids.splice(0, destroyed_asteroids.length);
			destroyed_meteors.splice(0, destroyed_meteors.length);
	
		} else {
			falconInvincible = true;
			setTimeout(function() { falconEnabled = true; falconInvincible = false; }, 2000);
		}
		
		$("#loader").fadeOut();
	});
	
	
	
}



function gameOverOverlay() {
	gameStarted = false;
	gameOver = true;
}

function debug() {
	ctx.textAlign = 'left';
	ctx.font = '15pt Courier New';
    ctx.fillStyle = 'lightgreen';
	ctx.fillText("IntoDarkness ver. " + ver, 10, 20);
	ctx.fillText("a: " + Math.round(falcon_fa, 2) + " x: " + Math.round(falcon_x, 2) + " y: " + Math.round(falcon_y, 2) + " vx: " + Math.round(falcon_vx, 2) + " vy: " + Math.round(falcon_vy, 2) + " tvx: " + Math.round(falcon_tvx, 2) + " tvy: " + Math.round(falcon_tvy, 2), 10, 40);
	ctx.fillText("bullets: " + bullets.length + " asteroids: " + asteroids.length,10, 60);
	ctx.fillText("fps: " + Math.round(fps, 0),10, 80);
	
	var meteorString = "";
	for(var i = 0; i < asteroids.length; i++) {
		if(i > 0) meteorString += ", ";
		meteorString += "" + i;
	}
	ctx.fillText("asteroids: [" + meteorString + "]",10, 100);
	
	var bulletString = "";
	for(var i = 0; i < bullets.length; i++) {
		if(i > 0) bulletString += ", ";
		bulletString += "" + i;
	}
	ctx.fillText("bullets: [" + bulletString + "]",10, 120);
	
	var explosionString = "";
	for(var i = 0; i < explosions.length; i++) {		
		if(i > 0) explosionString += ", ";
		explosionString += "" + i + " (" + explosions[i].type + "){" + explosions[i].spriteid + "}";
	}
	ctx.fillText("explosions: [" + explosionString + "]",10, 140);
	
	ctx.font = '5pt Courier New';
	var tempString30 = "";
	for(var i = 0; i < destroyed_asteroids.length; i++) {	
		tempString30 = destroyed_asteroids[i];
		ctx.fillText("." + tempString30, 10, 160 + (i * 7));
	}
	
	
}

function drawScore() {
	ctx.font = 'bold 15pt Arial';
    ctx.fillStyle = 'lightgreen';
	//ctx.strokeStyle = 'lightgreen';
	ctx.fillText(stats_destroyed, canvas.width - 60, 27);
	ctx.textAlign = 'right';
	
	var totalSec = (new Date().getTime() - stats_gameStartAt);
	var min = parseInt( totalSec/1000 / 60 ) % 60;
	var sec = parseInt(totalSec/1000 % 60);
	var ms = parseInt(totalSec % 1000);

	ctx.fillText(("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2) + "." + ("00" + ms).slice(-3), canvas.width - 250, 27);
	
	//ctx.fillText(stats_lives, canvas.width - 130, 27);
	//ctx.fillText("Players Online: " + 0, canvas.width - 245, 40);
	//ctx.strokeText("Asteroids: " + stats_destroyed + " Deaths: " + stats_deaths, canvas.width - 220, 20);
}

function drawLives() {
	var lifeIcon = new Image();
	
	lifeIcon.src = "game/images/asteroids/asteroid (0).png";
	ctx.drawImage(lifeIcon, (canvas.width - 110), 1, 40, 40);
	
	
	lifeIcon.src = "game/images/icons/solar-512.png";
	for(var i = 0; i < stats_lives; i++)
		ctx.drawImage(lifeIcon, (canvas.width - 160) - (40 * i), 0, 40, 40);
	
}

function drawFooter() {
	if(typeof footerData == 'undefined') return;
	ctx.font = 'bold 12pt Arial';
    ctx.fillStyle = 'white';
	ctx.textAlign = 'left';
	ctx.fillText("Players Online: " + footerData.online_users, 10, canvas.height - 20);
	ctx.textAlign = 'center';
	ctx.fillText("Global Rank: #" + footerData.user_rank, canvas.width/2, canvas.height - 20);
	ctx.textAlign = 'right';
	ctx.fillText("Hold L to toggle leaderboard", canvas.width - 20, canvas.height - 20);
	//ctx.fillText(stats_lives, canvas.width - 130, 27);
	//ctx.fillText("Players Online: " + 0, canvas.width - 245, 40);
	//ctx.strokeText("Asteroids: " + stats_destroyed + " Deaths: " + stats_deaths, canvas.width - 220, 20);
	
}


function saveInfo()
{
	$.post("ajax/stats.php", { action: 'save', a_fname: tek_fname, a_email: tek_email, score: stats_destroyed, alive: stats_timeAlive },  function(data) {
		//lol
	});
}

function onAssetLoad(e) {
	//console.log(e);
	$("#loadertext").text("Loading Assets: " + Math.floor(++assetsLoaded/(14 + maxAsteroidsIMG + maxBackgroundsIMG) * 100) + "%");
	
	if(assetsLoaded >= 14) {
		if(!gameLoaded) {
			gameLoaded = true;
			$("#cv-footer").fadeIn();
			$("#loader").css("opacity", "0.6").animate({'top': '95%', 'opacity': '0'}, { complete: function() { $(this).css('top', 'auto').animate({'opacity': '0.8', 'margin-left': 0, 'margin-top': 0, 'left':10, 'bottom':0 }, 500); }});

		}
		
		if(preLoadBackgrounds < maxBackgroundsIMG) {
			var img0 = new Image();
			img0.src = "game/images/backgrounds/background" + (preLoadBackgrounds++) + ".jpg";
			img0.onload = onAssetLoad;
		}
		
		if(preLoadAsteroids < maxAsteroidsIMG) {
			var img1 = new Image();
			img1.src = "game/images/asteroids/asteroid (" + (preLoadAsteroids++) + ").png";
			img1.onload = onAssetLoad;
		}
	}
	
	if(assetsLoaded >= maxBackgroundsIMG + maxAsteroidsIMG) {
		
		setTimeout(function() { $("#loader").fadeOut(); }, 2500);
	}
}
