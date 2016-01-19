var ver = "0.1a r8"
var canvas;
var ctx;

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

//System
var debugEnabled = false;
var gameStarted = false;
var gameOver = false;
var keys = [];
var lastCalledTime, fps, lastFPSUpdate = 0;
var canvasShake = false;
var sound_muted = false;

var start;

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

var transitionDirection = 1;
var transitionValue = 0;
var transitionInProgress = false;

window.addEventListener("load", onLoad);

function onLoad() {
	
	canvas = document.getElementById("game");
	ctx = canvas.getContext("2d");
	
	document.addEventListener("keydown", function(e) {
		if(!gameStarted) {
			if(!gameOver) {
				transitionInProgress = true;
				transitionDirection = 1;
				gameStarted = true;
				stats_deaths = stats_destroyed = 0;
				stats_gameStartAt = new Date().getTime();
			} else {
				gameOver = false;
			}
		}
		keys[e.keyCode] = true;
		if(e.keyCode == 32) {
					if(new Date().getTime() - last_shot > 180 ) {	
						shoot();
						last_shot = new Date().getTime();
					}
		}
	});
	
	document.addEventListener("keyup", function(e) {
		keys[e.keyCode] = false;
		
	});
	
	canvas.width  = window.innerWidth - ((5/100)*window.innerWidth);
	canvas.height = window.innerHeight - ((5/100)*window.innerHeight);
	
	falcon_x = canvas.width/2;
	falcon_y = canvas.height/2;
	
	music = document.createElement("audio");
	music.src = "audio/interstellar.mp3";
	music.loop = true;
	music.play();
		
	background = document.createElement("img");
	background.src = "images/backgrounds/background" + Math.floor(Math.random() * 15) + ".jpg";
	falcon = new Image();
	falcon.src = "images/mfalcon.png";
	falcon2 = new Image();
	falcon2.src = "images/mfalconacc.png";
	bullet_img = new Image();
	bullet_img.src = "images/bullet.png";
	
	explosionsprite[0] = new Image();
	explosionsprite[0].src = "images/explosion_sprite.png";
	explosionsprite[1] = new Image();
	explosionsprite[1].src = "images/explosion2_sprite.png";
	
	
	meteorsprite[0] = new Image();
	meteorsprite[0].src = "images/asteroids/meteorspritedown.png";
	meteorsprite[1] = new Image();
	meteorsprite[1].src = "images/asteroids/meteorspriteup.png";
	meteor_lastshower = new Date().getTime();
	
	wormhole[0] = new Image();
	wormhole[0].src = "images/wormhole1.png";
	wormhole[1] = new Image();
	wormhole[1].src = "images/wormhole2.png";
	wormhole_last = new Date().getTime(); //needed for initial delay of wormhole
	
	
	start = new Image();
	start.src = "images/start.png";
	gameStarted = false;
	
	end = new Image(); 
	end.src = "images/end.png";
	
	
	render();
	   
}


function asteroid_belt() {
	
	for(var i = 0; i < 5; i++) {
		var ax = canvas.width + 100;
		var ay = Math.floor(Math.random() * canvas.height);
		var aa = 110 - Math.floor(Math.random() * 150);
		var af = new Image();
		af.src = "images/asteroids/asteroid (" + (Math.floor(Math.random() * 64) + 1) + ").png";
		var asteroid = { angle: aa, x: ax, y: ay, img: af, size: 1 + Math.random()};
		asteroids.push(asteroid);
	}
	
	for(var i = 0; i < 5; i++) {
		var ax = - 100;
		var ay = Math.floor(Math.random() * canvas.height);
		var aa = 240 - Math.floor(Math.random() * 150);
		var af = new Image();
		af.src = "images/asteroids/asteroid (" + (Math.floor(Math.random() * 64) + 1) + ").png";
		var asteroid = { angle: aa, x: ax, y: ay, img: af, size: 1 + Math.random()};
		asteroids.push(asteroid);
	}
	asteroids_lastbelt = new Date().getTime();
}

function meteor_shower() {
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
	var meteor = { angle: aa, x: ax, y: ay, frameid: 0, type: ty};
	meteors.push(meteor);
		
	meteor_lastshower = new Date().getTime();
}


function render() {
	
	requestAnimationFrame(render);
	
	
	checkBounds();
	
	if(new Date().getTime() - asteroids_lastbelt > 5000) {
		asteroid_belt();
	}
	 
	if(new Date().getTime() - meteor_lastshower > 10000) {
		meteor_shower();
	}
	
	if(new Date().getTime() - wormhole_last > 20000) {
		wormholeTransition = 0;
		wormholeTransitionInProgress = true;
		wormholeTransitionDirection = 0;
		wormhole_x = 50 + Math.random() * (canvas.width - 120);
		wormhole_y = 50 + Math.random() * (canvas.height - 120);
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
	
	
	if(keys[38] == true) {
		acc = 3;
		accelerate(); 
	}
	
	
	
	move();
	drawBackground();
	
	if(wormholeEnabled) drawWormhole();
	
	drawFalcon();
	
	render_objects();
	
	//Transition
	if(transitionInProgress) {
		transitionValue = transitionDirection == 1 ? transitionValue + 0.05 : transitionValue - 0.05;
		falcon_w = transitionDirection == 1 ? falcon_w - 5 : falcon_w + 5;
		falcon_h = transitionDirection == 1 ? falcon_h - 5 : falcon_h + 5; //There might be a problem here if frames are skipped? (resizing the falcon back to normal), add reset width and height to original values when transition is complete
		
		drawBlackBG(transitionValue);
		if(transitionValue < 0.01) transitionInProgress = false;
		if(transitionValue > 0.99) {
			background.src = "images/backgrounds/background" + Math.floor(Math.random() * 7) + ".jpg";
			transitionDirection = 0;
			
			asteroids.splice(0, asteroids.length);
			meteors.splice(0, meteors.length);
		
		}
	}
	
	drawScore();
	
	if(!gameStarted) 
	{
		ctx.globalAlpha = 0.3;
		ctx.drawImage(background, - 5, -5);
		ctx.drawImage(background, - 3, -3);
		ctx.drawImage(background, 0, 0);
		ctx.drawImage(background, -11, -9);
		ctx.drawImage(background, -10, -10);
		ctx.globalAlpha = 1;
		
		if(!gameOver) {
			ctx.drawImage(start, 0, 0, canvas.width, canvas.height);
		} else {

			ctx.drawImage(end, 0, 0, canvas.width, canvas.height);
			ctx.font = 'bold 35pt Arial';
			ctx.fillStyle = 'red';
			ctx.textAlign = "center"; 
			ctx.fillText("Asteroids destroyed: " + stats_destroyed, canvas.width/2, canvas.height/2 + 50);
			ctx.fillText("Time Alive: " + stats_timeAlive + " seconds", canvas.width/2, canvas.height/2);
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
	ctx.drawImage(keys[38] == true && engineOn ? falcon2 : falcon, -falcon_w/2, -falcon_h/2, falcon_w, falcon_h);
	ctx.restore();
	
}



function shoot() {
	var bullet = { angle: falcon_fa, x: falcon_x, y: falcon_y };
	bullets.push(bullet);
	
	if(!sound_muted) {
		sound = document.createElement("audio");
		sound.src = "audio/pew.mp3";
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
		asteroids[i].x = asteroids[i].x - 3* Math.cos(asteroids[i].angle * Math.PI/180);
		asteroids[i].y = asteroids[i].y - 3* Math.sin(asteroids[i].angle * Math.PI/180);
		var current_asteroid_radius = asteroid_radius * asteroids[i].size;
		ctx.drawImage(asteroids[i].img, asteroids[i].x - current_asteroid_radius, asteroids[i].y - current_asteroid_radius, current_asteroid_radius * 2, current_asteroid_radius * 2);
		
		ctx.font = '10pt Courier New';
		if(debugEnabled) ctx.fillText("x: " + Math.round(asteroids[i].x, 1) + " y: " + Math.round(asteroids[i].y, 1) + " a: " + Math.round(asteroids[i].angle, 1), asteroids[i].x, asteroids[i].y);
		
		if(isOutOfBounds(asteroids[i].x, asteroids[i].y)) {
			var index = asteroids.indexOf(asteroids[i]);
			asteroids.splice(index, 1);
		}
	} 

	for(var i = 0; i < meteors.length; i++) {
		meteors[i].x = meteors[i].x - 5* Math.cos(meteors[i].angle * Math.PI/180);
		meteors[i].y = meteors[i].y - 5* Math.sin(meteors[i].angle * Math.PI/180);
		
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
			if(inRange(meteors[i].x, meteors[i].y, bullets[j].x, bullets[j].y, 15)) {
				
		
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "audio/explosion" + ((i+j)%2==0?1:2) + ".mp3";
					sound.play();
				}
	
				canvasShake = true;
				setTimeout(function() { canvasShake = false; }, 500);
	
				explosions.push({ x:meteors[i].x, y:meteors[i].y, spriteid: 0, type: 0 });
				meteors.splice(meteors.indexOf(meteors[i]), 1);
				bullets.splice(bullets.indexOf(bullets[j]), 1);
				current_meteor_status = false;
				
				stats_destroyed++;
				break;
			}
		}
		
		if(!current_meteor_status) continue;
		
		//Falcon-Meteor Collision
		if(inRange(falcon_x, falcon_y, meteors[i].x, meteors[i].y, 30)) {
				
				
				falcon_vx = 0;
				falcon_vy = 0;
				
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "audio/explosion3.mp3";
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
			if(inRange(asteroids[i].x, asteroids[i].y, bullets[j].x, bullets[j].y, 15 * asteroids[i].size)) {
				
		
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "audio/explosion" + ((i+j)%2==0?1:2) + ".mp3";
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
		if(inRange(falcon_x, falcon_y, asteroids[i].x, asteroids[i].y, 30 * asteroids[i].size)) {
				
				falcon_vx = 0;
				falcon_vy = 0;
				
				if(!sound_muted) {
					sound = document.createElement("audio");
					sound.src = "audio/explosion3.mp3";
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
	
//	if(falcon_fa != falcon_tfa) falcon_fa += falcon_tfa < falcon_fa ? 2: -2;

	
}

function closeWormhole() {
	wormholeTransitionDirection = 1;
	wormholeTransitionInProgress = true;
}

function drawBlackBG(a) {
	ctx.globalAlpha = a;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 1;
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
	if(gameStarted) {
		gameStarted = false;
		if(!gameOver) stats_timeAlive = (new Date().getTime() - stats_gameStartAt)/1000;
		gameOver = true;
		falcon_x = canvas.width/2;
		falcon_y = canvas.height/2;
		falcon_fa = 90;
	}
		
}

function debug() {
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
	ctx.fillText("meteors: [" + meteorString + "]",10, 100);
	
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
	
}

function drawScore() {
	ctx.font = 'bold 15pt Arial';
    ctx.fillStyle = 'lightgreen';
	//ctx.strokeStyle = 'lightgreen';
	ctx.fillText("Asteroids: " + stats_destroyed + "  Deaths: " + stats_deaths, canvas.width - 245, 20);
	ctx.fillText("Players Online: " + 0, canvas.width - 245, 40
	);
	//ctx.strokeText("Asteroids: " + stats_destroyed + " Deaths: " + stats_deaths, canvas.width - 220, 20);
}