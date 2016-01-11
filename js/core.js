var ver = "0.1a r8"
var canvas;
var ctx;

//Images
var falcon, falcon2;
var background;
var bullet_img;
var explosionsprite;

//Explosion
var explosion_radius = 192/2;
var explosions = [];

//Falcon Coords
var falcon_w = 100, falcon_h = 100;
var falcon_x, falcon_y;
var falcon_vx = 0, falcon_vy = 0;
var falcon_tvx = 0, falcon_tvy = 0;
var falcon_fa = 90;

//Objects
var bullets = [];

var asteroid_radius = 20;
var asteroids = [];
var asteroids_lastbelt = 0;

var last_shot = 0;

//Audio Elements
var sound;
var music;

var acc = 0;

//System
var keys = [];
var lastCalledTime, fps, lastFPSUpdate = 0;
var canvasShake = false;

window.addEventListener("load", onLoad);

function onLoad() {
	
	canvas = document.getElementById("game");
	ctx = canvas.getContext("2d");
	
	document.addEventListener("keydown", function(e) {
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
	
	sound = document.createElement("audio");
	sound.src = "audio/interstellar.mp3";
	sound.loop = true;
	sound.play();
		
	background = document.createElement("img");
	background.src = "images/background.jpg";
	falcon = new Image();
	falcon.src = "images/mfalcon.png";
	falcon2 = new Image();
	falcon2.src = "images/mfalconacc.png";
	bullet_img = new Image();
	bullet_img.src = "images/bullet.png";
	explosionsprite = new Image();
	explosionsprite.src = "images/explosion_sprite.png";
	
	
	
	render();
	   
}


function asteroid_belt() {
	
	for(var i = 0; i < 5; i++) {
		var ax = canvas.width + 100;
		var ay = Math.floor(Math.random() * canvas.height);
		var aa = 110 - Math.floor(Math.random() * 150);
		var af = new Image();
		af.src = "images/asteroids/asteroid (" + (Math.floor(Math.random() * 64) + 1) + ").png";
		var asteroid = { angle: aa, x: ax, y: ay, img: af};
		asteroids.push(asteroid);
	}
	
	for(var i = 0; i < 5; i++) {
		var ax = - 100;
		var ay = Math.floor(Math.random() * canvas.height);
		var aa = 240 - Math.floor(Math.random() * 150);
		var af = new Image();
		af.src = "images/asteroids/asteroid (" + (Math.floor(Math.random() * 64) + 1) + ").png";
		var asteroid = { angle: aa, x: ax, y: ay, img: af};
		asteroids.push(asteroid);
	}
	asteroids_lastbelt = new Date().getTime();
}



function render() {
	requestAnimationFrame(render);
	
	checkBounds();
	
	if(new Date().getTime() - asteroids_lastbelt > 5000) {
		asteroid_belt();
	}
	
	falcon_fa -= keys[37] == true ? 5 : 0;
		falcon_fa = falcon_fa < -360 ? 0 : falcon_fa;
	
	falcon_fa += keys[39] == true ? 5 : 0;
		falcon_fa = falcon_fa > 360 ? 0 : falcon_fa;
	
	
	if(keys[38] == true) {
		acc = 3;
		accelerate(); 
	}
	
	move();
	drawBackground();
	drawFalcon();
	render_objects();
	
	
	debug();

	delta = (new Date().getTime() - lastCalledTime)/1000;
	if(new Date().getTime() - lastFPSUpdate > 100) {
			fps = 1/delta;
			lastFPSUpdate = Date.now();
	}
	lastCalledTime = Date.now();
	
}

function drawBackground() {
	if(canvasShake) {
		ctx.drawImage(background, Math.random() * 10 + 0.1 * (-1920/2 - falcon_x + canvas.width/2), Math.random() * 10 + 0.1 *(-1200/2 - falcon_y + canvas.height/2));
	} else 
	ctx.drawImage(background, 0.1 * (-1920/2 - falcon_x + canvas.width/2), 0.1 *(-1200/2 - falcon_y + canvas.height/2));
}

function drawFalcon() {

	ctx.save();
	ctx.translate(falcon_x, falcon_y);
	ctx.rotate((falcon_fa - 90) * Math.PI/180);
	ctx.drawImage(keys[38] == true ? falcon2 : falcon, -falcon_w/2, -falcon_h/2, falcon_w, falcon_h);
	ctx.restore();
	
}

function shoot() {
	var bullet = { angle: falcon_fa, x: falcon_x, y: falcon_y };
	bullets.push(bullet);
	
	sound = document.createElement("audio");
	sound.src = "audio/pew.mp3";
	sound.play();

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
		ctx.drawImage(asteroids[i].img, asteroids[i].x - asteroid_radius, asteroids[i].y - asteroid_radius, asteroid_radius * 2, asteroid_radius * 2);
		
		ctx.font = '10pt Courier New';
		ctx.fillText("x: " + Math.round(asteroids[i].x, 1) + " y: " + Math.round(asteroids[i].y, 1) + " a: " + Math.round(asteroids[i].angle, 1), asteroids[i].x, asteroids[i].y);
		
		if(isOutOfBounds(asteroids[i].x, asteroids[i].y)) {
			var index = asteroids.indexOf(asteroids[i]);
			asteroids.splice(index, 1);
		}
	} 

	for(var i = 0; i < asteroids.length; i++) {
		for(var j = 0; j < bullets.length; j++) {
			if(inRange(asteroids[i].x, asteroids[i].y, bullets[j].x, bullets[j].y, 15)) {
				
				sound = document.createElement("audio");
				sound.src = "audio/explosion" + ((i+j)%2==0?1:2) + ".mp3";
				sound.play();
	
				canvasShake = true;
				setTimeout(function() { canvasShake = false; }, 1000);
	
				explosions.push({ x:asteroids[i].x, y:asteroids[i].y, spriteid: 0 });
				asteroids.splice(asteroids.indexOf(asteroids[i]), 1);
				break;
			}
		}
	}
	
	for(var i = 0; i < explosions.length; i++) {
		
		ctx.drawImage(explosionsprite, (explosion_radius * 2) * explosions[i].spriteid, 0, explosion_radius * 2, explosion_radius * 2, explosions[i].x - explosion_radius, explosions[i].y - explosion_radius, explosion_radius * 2, explosion_radius * 2);
		if(explosions[i].spriteid++ > 64) {
			explosions.splice(explosions.indexOf(explosions[i]), 1);
		}
	}
}


function accelerate() {
	
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
	
	//
	falcon_x += falcon_vx;
	falcon_y += falcon_vy;
	
}





function checkBounds() {
	if(falcon_x > canvas.width - falcon_w/2 || falcon_x < falcon_w/2) {
		falcon_vx = -falcon_vx;
	} 	
	
	if(falcon_y > canvas.height - falcon_h/2 || falcon_y < falcon_h/2)	{
			falcon_vy = -falcon_vy;
	}
	
}

function isOutOfBounds(x, y) {
	return x > canvas.width + 200 || x < -200 || y > canvas.height + 200 || y < -200;
}

function inRange(x, y, px, py, radius) {
	return (x > px - radius && x < px + radius && y > py - radius && y < py + radius);
}

function debug() {
	ctx.font = '15pt Courier New';
    ctx.fillStyle = 'lightgreen';
	ctx.fillText("IntoDarkness ver. " + ver, 10, 20);
	ctx.fillText("a: " + Math.round(falcon_fa, 2) + " x: " + Math.round(falcon_x, 2) + " y: " + Math.round(falcon_y, 2) + " vx: " + Math.round(falcon_vx, 2) + " vy: " + Math.round(falcon_vy, 2) + " tvx: " + Math.round(falcon_tvx, 2) + " tvy: " + Math.round(falcon_tvy, 2), 10, 40);
	ctx.fillText("bullets: " + bullets.length + " asteroids: " + asteroids.length,10, 60);
	ctx.fillText("fps: " + Math.round(fps, 0),10, 80);
}